import { type PrismaClient } from "@prisma/client";
import { type Stripe } from 'stripe';
import { type Session } from "next-auth";


interface BaseArgs {
    session: Session,
    prisma: PrismaClient,
    stripe: Stripe,
}

export const forceStripeSessionExpire = async ({session, prisma, stripe}: BaseArgs) => {
    // Get pending session details from db
    const pendingStripeSession = await prisma.pendingStripeSession.findFirst({
        where: {
            userId: session.user.id
        },
    })
    if (!pendingStripeSession) {
        throw new Error("Expected pending session entry...");
    }

    // Manually expire Stripe Session
    await stripe.checkout.sessions.expire(
        pendingStripeSession.stripeSession
    );
};

export const createStripeSessionResume = async ({session, prisma, stripe}: BaseArgs) => {
    const pendingStripeSessionRecord = await prisma.pendingStripeSession.findUnique({
        where: {
            userId: session.user.id,
        }
    })

    if (!pendingStripeSessionRecord) {
        return { 
            url: null,
            cancelUrl: null,
        };
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(
        pendingStripeSessionRecord.stripeSession
    );

    if (!stripeSession) {
        throw new Error("Could not create retrieve checkout session");
    }

    return { 
        url: stripeSession.url,
        cancelUrl: stripeSession.cancel_url,
    };
}