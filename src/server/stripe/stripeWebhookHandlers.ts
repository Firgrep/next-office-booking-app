import { type PrismaClient } from "@prisma/client";
import { type Stripe } from 'stripe';


interface GetOrCreateStripeCustomerIdForUserProps {
    stripe: Stripe;
    prisma: PrismaClient;
    userId: string;
}

export const getOrCreateStripeCustomerIdForUser = async ({
    stripe,
    prisma,
    userId,
}: GetOrCreateStripeCustomerIdForUserProps) => {
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

interface HandleInvoicePaidProps {
    event: Stripe.Event;
    stripe: Stripe;
    prisma: PrismaClient;
}

export const handleInvoicePaid = async ({
    event,
    stripe,
    prisma,
}: HandleInvoicePaidProps) => {
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

interface HandleSubscriptionCreatedOrUpdatedProps {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSubscriptionCreatedOrUpdated = async({
    event,
    prisma
}: HandleSubscriptionCreatedOrUpdatedProps) => {
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

interface HandleSubscriptionCanceledProps {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSubscriptionCanceled = async ({
    event,
    prisma
}: HandleSubscriptionCanceledProps) => {
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

interface HandleCustomerIdDeletedProps {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleCustomerIdDeleted = async ({
    event,
    prisma
}: HandleCustomerIdDeletedProps) => {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata.userId;

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            stripeCustomerId: null,
        },
    });
};

interface HandleSessionExpiryProps {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSessionExpiry = async ({
    event,
    prisma
}: HandleSessionExpiryProps) => {
    const expiredSession = event.data.object as Stripe.Checkout.Session;
    const expiredSessionId = expiredSession.id;

    const pendingStripeSession = await prisma.pendingStripeSession.findFirst({
        where: {
            stripeSession: expiredSessionId
        },
    });

    if (!pendingStripeSession) {
        // * In the event pending session is not found, it is likely because
        // * it is a checkout related to subscription.
        return;
    }

    // Delete pending session entry and booking
    await prisma.pendingStripeSession.delete({
        where: {
            id: pendingStripeSession.id,
        },
    });
    await prisma.booking.delete({
        where: {
            id: pendingStripeSession.bookingId,
        },
    });
};

interface HandleSessionCompletedProps {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSessionCompleted = async ({
    event,
    prisma
}: HandleSessionCompletedProps) => {
    const completedSession = event.data.object as Stripe.Checkout.Session;
    const completedSessionId = completedSession.id;
    const paymentIntentId = completedSession.payment_intent;

    const pendingStripeSession = await prisma.pendingStripeSession.findFirst({
        where: {
            stripeSession: completedSessionId
        },
    })

    if (!pendingStripeSession) {
        // * In the event pending session is not found, it is likely because
        // * it is a checkout related to subscription.
        return;
    }

    // Upon successfully completed session, the payment_intent ID is retrieved from the
    // completed session object and stored on the booking entry (using the ID from the
    // pending stripe session entry) to use for future potential refunds. 
    if (typeof paymentIntentId === "string") {
        await prisma.booking.update({
            where: {
                id: pendingStripeSession.bookingId,
            },
            data: {
                paymentIntentId: paymentIntentId,
            }
        });
    }

    // Finally, delete the pending stripe session entry as all business has been concluded.
    await prisma.pendingStripeSession.delete({
        where: {
            id: pendingStripeSession.id,
        },
    });
};

// TODO cleanup
// interface HandleChargeSucceededProps {
//     event: Stripe.Event;
//     prisma: PrismaClient;
// }

// export const handleChargeSucceeded = async ({
//     event,
//     prisma,
// }: HandleChargeSucceededProps ) => {
//     const succeededCharge = event.data.object as Stripe.Charge;
//     console.log("---SUCCESS CHARGE OBJECT \n", succeededCharge)
//     return
// }