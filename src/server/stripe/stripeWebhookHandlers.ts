import { type PrismaClient } from "@prisma/client";
import { type Stripe } from 'stripe';


interface getOrCreateStripeCustomerIdForUserObject {
    stripe: Stripe,
    prisma: PrismaClient,
    userId: string,
}

export const getOrCreateStripeCustomerIdForUser = async ({
    stripe,
    prisma,
    userId,
}: getOrCreateStripeCustomerIdForUserObject) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) throw new Error("User not found");

    if (user.stripeCustomerId) {
        return user.stripeCustomerId;
    }

    // If a Stripe customer ID does not already exist, proceed to make a new one
    const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        // Use metadata to link this Stripe customer to internal user ID 
        metadata: {
            userId,
        },
    });

    // Update user in database with new Stripe customer ID
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            stripeCustomerId: customer.id
        },
    });

    if (updatedUser.stripeCustomerId) {
        return updatedUser.stripeCustomerId;
    }
};

interface handleInvoicePaidObject {
    event: Stripe.Event;
    stripe: Stripe;
    prisma: PrismaClient;
}

export const handleInvoicePaid = async ({
    event,
    stripe,
    prisma,
}: handleInvoicePaidObject) => {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription;
    const subscription = await stripe.subscriptions.retrieve(
        subscriptionId as string
    );

    await prisma.user.update({
        where: {
            stripeSubscriptionId: subscription.id,
        },
        data: {
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
    });
};

interface handleSubscriptionCreatedOrUpdatedObject {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSubscriptionCreatedOrUpdated = async({
    event,
    prisma
}: handleSubscriptionCreatedOrUpdatedObject) => {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.userId;

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            stripeSubscriptionId: subscription.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0]?.price.id,
        },
    });
};

interface handleSubscriptionCanceledObject {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSubscriptionCanceled = async ({
    event,
    prisma
}: handleSubscriptionCanceledObject) => {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.userId;

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            stripeCurrentPeriodEnd: null,
            stripeSubscriptionId: null,
            stripePriceId: null,
        },
    });
};
