import { type PrismaClient } from "@prisma/client";
import { type Stripe } from 'stripe';


interface GetOrCreateStripeCustomerIdForUserObject {
    stripe: Stripe,
    prisma: PrismaClient,
    userId: string,
}

export const getOrCreateStripeCustomerIdForUser = async ({
    stripe,
    prisma,
    userId,
}: GetOrCreateStripeCustomerIdForUserObject) => {
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

interface HandleInvoicePaidObject {
    event: Stripe.Event;
    stripe: Stripe;
    prisma: PrismaClient;
}

export const handleInvoicePaid = async ({
    event,
    stripe,
    prisma,
}: HandleInvoicePaidObject) => {
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

interface HandleSubscriptionCreatedOrUpdatedObject {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSubscriptionCreatedOrUpdated = async({
    event,
    prisma
}: HandleSubscriptionCreatedOrUpdatedObject) => {
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

interface HandleSubscriptionCanceledObject {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleSubscriptionCanceled = async ({
    event,
    prisma
}: HandleSubscriptionCanceledObject) => {
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

interface HandleCustomerIdDeletedOject {
    event: Stripe.Event;
    prisma: PrismaClient;
}

export const handleCustomerIdDeleted = async ({
    event,
    prisma
}: HandleCustomerIdDeletedOject) => {
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

interface HandleSessionExpiry {
    event: Stripe.Event;
    prisma: PrismaClient
}

export const handleSessionExpiry = async ({
    event,
    prisma
}: HandleSessionExpiry) => {
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

interface HandleSessionCompleted {
    event: Stripe.Event;
    prisma: PrismaClient
}

export const handleSessionCompleted = async ({
    event,
    prisma
}: HandleSessionCompleted) => {
    const completedSession = event.data.object as Stripe.Checkout.Session;
    const completedSessionId = completedSession.id;

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

    await prisma.pendingStripeSession.delete({
        where: {
            id: pendingStripeSession.id,
        },
    });
};
