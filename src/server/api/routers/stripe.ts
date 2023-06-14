import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { flexPayPlan, proPlan } from "~/constants/subscriptions";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripeWebhookHandlers";
import { env } from "~/env.mjs";
import { UserSubscriptionPlan } from "~/types";
import { PrismaClient } from "@prisma/client";


const getUserSubscription = async ({
    prisma,
    userId
}: {
    prisma: PrismaClient,
    userId: string
}): Promise<UserSubscriptionPlan> => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            stripeCustomerId: true,
            stripeSubscriptionId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
        },
    });

    if (!user) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
        });
    }

    let isPro: boolean;

    if (
        user?.stripePriceId &&
        user?.stripeCurrentPeriodEnd &&
        user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    ) {
        isPro = true;
    } else {
        isPro = false;
    }

    const plan = isPro ? proPlan : flexPayPlan;
    
    return {
        ...user,
        ...plan,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
        isPro,
    };
};

export const stripeRouter = createTRPCRouter({
    getUserSubscriptionPlan: protectedProcedure
        .query(async ({ ctx }): Promise<UserSubscriptionPlan> => {
            return getUserSubscription({ prisma: ctx.prisma, userId: ctx.session.user.id});
        }),
    checkUserStripeCancellation: protectedProcedure
        .input(
            z
                .object({
                    isPro: z.boolean().nullish().optional(),
                    stripeSubscriptionId: z.string().nullish().optional(),
                }))
        .query(async ({ctx, input}) => {
            if (!input.isPro || !input.stripeSubscriptionId) {
                return false;
            }

            const stripePlan = await ctx.stripe.subscriptions.retrieve(
                input.stripeSubscriptionId
            );
            if (stripePlan.cancel_at_period_end === true) {
                return true;
            } else {
                return false;
            }
        }),
    createBillingOrCheckoutSession: protectedProcedure
        .mutation(async ({ ctx }) => {
            const { stripe, session, prisma, req } = ctx;

            const baseUrl = 
                env.NODE_ENV === "development"
                    ? `http://${req.headers.host ?? "localhost:3000"}`
                    : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

            const userSubscriptionPlan = await getUserSubscription({ prisma: ctx.prisma, userId: ctx.session.user.id});

            // If the user is on the pro plan, create a portal session to manage subscription.
            if (userSubscriptionPlan.isPro && userSubscriptionPlan.stripeCustomerId) {
                const stripeSession = await stripe.billingPortal.sessions.create({
                    customer: userSubscriptionPlan.stripeCustomerId,
                    return_url: `${baseUrl}/account/billing`,
                });

                if (!stripeSession) {
                    throw new Error("Could not create billing portal session");
                }

                return { url: stripeSession.url };
            }

            // If the user is on the flexPay plan, create a checkout sessiont to upgrade.
            const customerId = await getOrCreateStripeCustomerIdForUser({
                prisma,
                stripe,
                userId: session.user?.id
            })

            if (!customerId) {
                throw new Error("Could not create customer");
            }
            
            const stripeSession = await stripe.checkout.sessions.create({
                customer: customerId,
                client_reference_id: session.user?.id,
                payment_method_types: ["card"],
                mode: "subscription",
                line_items: [
                    {
                        price: env.STRIPE_PRO_MONTHLY_PLAN_ID,
                        quantity: 1,
                    }
                ],
                success_url: `${baseUrl}/account/billing`,
                cancel_url: `${baseUrl}/account/billing`,
                subscription_data: {
                    metadata: {
                        userId: session.user?.id,
                    },
                },
            });

            if (!stripeSession) {
                throw new Error("Could not create checkout session");
            }

            return { url: stripeSession.url };
        })
});
