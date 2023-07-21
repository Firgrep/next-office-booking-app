import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import type Stripe from "stripe";
import { buffer } from 'micro';
import { 
    handleCustomerIdDeleted,
    handleInvoicePaid,
    handleSessionCompleted,
    handleSessionExpiry,
    handleSubscriptionCanceled,
    handleSubscriptionCreatedOrUpdated,
} from '../../server/stripe/stripeWebhookHandlers';
import { stripe } from '../../server/stripe/stripeClient';


export const config = {
    api: {
        bodyParser: false,
    },
}

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const buf = await buffer(req);
        const sig = req.headers["stripe-signature"];

        let event: Stripe.Event; // for event types list, see https://stripe.com/docs/api/events/types

        try {
            event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

            // Handle the event
            switch (event.type) {
                case "invoice.paid":
                    // Used to provision services after the trial has ended.
                    // The status of the invoice will show up as paid. Handle it in the database.
                    await handleInvoicePaid({
                        event, stripe, prisma,
                    });
                    break;
                case "customer.subscription.created":
                    // Used to provision services as they are added to a subscription.
                    await handleSubscriptionCreatedOrUpdated({
                        event, prisma,
                    });
                    break;
                case "customer.subscription.updated":
                    // Used when user downgrades or upgrades their subscription
                    await handleSubscriptionCreatedOrUpdated({
                        event, prisma,
                    });
                    break;
                case "customer.deleted":
                    await handleCustomerIdDeleted({
                        event, prisma,
                    });
                    break;
                case "invoice.payment_failed":
                    console.log("RECEIEVED PAYMENT FAILED");
                    // ! If the payment fails or the customer does not have a valid payment method,
                    // ! an invoice.payment_failed event is sent, the subscription becomes past_due.
                    // ! Use this webhook to notify your user that their payment has failed and
                    // ! to retrieve new card details.
                    // ! Can also have Stripe send an email to the customer notifying them of the failure.
                    break;
                case "customer.subscription.deleted":
                    await handleSubscriptionCanceled({
                        event, prisma,
                    });
                    break;
                case "checkout.session.expired":
                    await handleSessionExpiry({
                        event, prisma
                    });
                    break;
                case "checkout.session.completed":
                    await handleSessionCompleted({
                        event, prisma
                    });
                    break;
                // TODO cleanup
                // case "charge.succeeded":
                //     await handleChargeSucceeded({
                //         event, prisma
                //     });
                default:
                    // Unexpected event type
            }

            if (env.NODE_ENV === "development") {
                console.log("Development mode in stripe webhook -- bypassing stripe event db record");
            }

            // Record the event in the database (unless development mode)
            if (env.NODE_ENV !== "development") {
                await prisma.stripeEvent.create({
                    data: {
                        id: event.id,
                        type: event.type,
                        object: event.object,
                        api_version: event.api_version,
                        account: event.account,
                        created: new Date(event.created * 1000),
                        data: {
                            object: event.data.object,
                            previous_attributes: event.data.previous_attributes,
                        },
                        livemode: event.livemode,
                        pending_webhooks: event.pending_webhooks,
                        request: {
                            id: event.request?.id,
                            idempotency_key: event.request?.idempotency_key,
                        },
                    },
                });
            }

            res.json({ received: true });
        } catch (err) {
            res.status(400).send(err);
            return;
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
