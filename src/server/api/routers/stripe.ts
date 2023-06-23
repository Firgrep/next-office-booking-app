import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { 
    flexPayPlan, 
    proPlan,
    plusPlanConference, 
    plusPlanPhone, 
    basicPlan 
} from "~/constants/server/subscriptions";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripeWebhookHandlers";
import { env } from "~/env.mjs";
import { SubscriptionPlan, UserSubscriptionPlan } from "~/types";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next/types";


const getBaseUrl = (req: NextApiRequest) => {
    const baseUrl = 
        env.NODE_ENV === "development"
            ? `http://${req.headers.host ?? "localhost:3000"}`
            : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;
    return baseUrl;
};

const checkUserSubscriptionPlan = (userSubscriptionPlan: UserSubscriptionPlan): boolean => {
    if (userSubscriptionPlan.isPro ||
        userSubscriptionPlan.isBasic ||
        userSubscriptionPlan.isPlusConference ||
        userSubscriptionPlan.isPlusPhone
    ) {
        return true;
    } else {
        return false;
    }
};

const getUserSubscriptionDetails = async ({
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
    let isPlusConference: boolean;
    let isPlusPhone: boolean;
    let isBasic: boolean;

    let plan: SubscriptionPlan;

    // Given the app has many different subscriptions, first the user is 
    // checked if any valid subscriptions exist. 
    if (
        user?.stripePriceId &&
        user?.stripeCurrentPeriodEnd &&
        user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    ) {
        // If valid subscription exists, the type of subscription is checked.
        switch (user.stripePriceId) {
            case env.STRIPE_PRO_MONTHLY_PLAN_ID:
                isPro = true; // ! Exclusive true
                isPlusConference = false;
                isPlusPhone = false;
                isBasic = false;
                plan = proPlan;
                break;
            case env.STRIPE_PLUS_CONFERENCE_MONTHLY_PLAN_ID:
                isPro = false;
                isPlusConference = true; // ! Exclusive true
                isPlusPhone = false;
                isBasic = false;
                plan = plusPlanConference;
                break;
            case env.STRIPE_PLUS_PHONE_MONTHLY_PLAN_ID:
                isPro = false;
                isPlusConference = false;
                isPlusPhone = true; // ! Exclusive true
                isBasic = false;
                plan = plusPlanPhone;
                break;
            case env.STRIPE_BASIC_MONTHLY_PLAN_ID:
                isPro = false;
                isPlusConference = false;
                isPlusPhone = false;
                isBasic = true; // ! Exclusive true
                plan = basicPlan;
                break;
            default:
                isPro = false;
                isPlusConference = false;
                isPlusPhone = false;
                isBasic = false;
                plan = flexPayPlan;
        }
    } else {
        isPro = false;
        isPlusConference = false;
        isPlusPhone = false;
        isBasic = false;
        plan = flexPayPlan;
    }

    return {
        ...user,
        ...plan,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
        isPro,
        isPlusConference,
        isPlusPhone,
        isBasic
    };
};

export const stripeRouter = createTRPCRouter({
    getUserSubscriptionPlan: protectedProcedure
        .query(async ({ ctx }): Promise<UserSubscriptionPlan> => {
            return getUserSubscriptionDetails({ prisma: ctx.prisma, userId: ctx.session.user.id});
        }),
    checkUserStripeCancellation: protectedProcedure
        .input(
            z
                .object({
                    stripeSubscriptionId: z.string().nullish().optional(),
                }))
        .query(async ({ctx, input}) => {
            if (
                !input.stripeSubscriptionId
            ) {
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

            const userSubscriptionPlan = await getUserSubscriptionDetails({ prisma: ctx.prisma, userId: ctx.session.user.id});

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

            // If the user is on the flexPay plan, create a checkout session to upgrade.
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
                    },
                    {
                        price: env.STRIPE_PLUS_CONFERENCE_MONTHLY_PLAN_ID,
                        quantity: 1,
                    },
                    {
                        price: env.STRIPE_PLUS_PHONE_MONTHLY_PLAN_ID,
                        quantity: 1,
                    },
                    {
                        price: env.STRIPE_BASIC_MONTHLY_PLAN_ID,
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
        }),
    createBillingSession: protectedProcedure
        .mutation(async ({ ctx }) => {
            const baseUrl = getBaseUrl(ctx.req);
            const userSubscriptionPlan = await getUserSubscriptionDetails({ prisma: ctx.prisma, userId: ctx.session.user.id});
            
            if (checkUserSubscriptionPlan(userSubscriptionPlan) && userSubscriptionPlan.stripeCustomerId) {
                const stripeSession = await ctx.stripe.billingPortal.sessions.create({
                    customer: userSubscriptionPlan.stripeCustomerId,
                    return_url: `${baseUrl}/account/billing`,
                });

                if (!stripeSession) {
                    throw new Error("Could not create billing portal session");
                }

                return { url: stripeSession.url };
            }
            throw new Error("Could not authenticate user for billing procedure.");
        }),
    createSubscriptionCheckoutSession: protectedProcedure
        .input(
            z
                .object({
                    subTier: z.enum(['pro', 'basic', 'plusConference', 'plusPhone']),
                }))
        .mutation(async ({ctx, input}) => {
            const baseUrl = getBaseUrl(ctx.req);
            const { prisma, stripe } = ctx;

            if(!ctx.session.user?.id) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                })
            }

            const customerId = await getOrCreateStripeCustomerIdForUser({
                prisma,
                stripe,
                userId: ctx.session.user.id
            })

            if (!customerId) {
                throw new Error("Could not create customer");
            }

            const purchase = {
                price: "",
                quantity: 1,
            }

            switch (input.subTier) {
                case "pro":
                    purchase.price = env.STRIPE_PRO_MONTHLY_PLAN_ID;
                    break;
                case "plusConference":
                    purchase.price = env.STRIPE_PLUS_CONFERENCE_MONTHLY_PLAN_ID;
                    break;
                case "plusPhone":
                    purchase.price = env.STRIPE_PLUS_PHONE_MONTHLY_PLAN_ID;
                    break;
                case "basic":
                    purchase.price = env.STRIPE_BASIC_MONTHLY_PLAN_ID;
                    break;
                default:
                    throw new Error("No subTier matches any case in checkout route");
            }
            
            const stripeSession = await ctx.stripe.checkout.sessions.create({
                customer: customerId,
                client_reference_id: ctx.session.user?.id,
                payment_method_types: ["card"],
                mode: "subscription",
                line_items: [ purchase ],
                success_url: `${baseUrl}/account/billing`,
                cancel_url: `${baseUrl}/account/billing`,
                subscription_data: {
                    metadata: {
                        userId: ctx.session.user?.id,
                    },
                },
            });

            if (!stripeSession) {
                throw new Error("Could not create checkout session");
            }

            return { url: stripeSession.url };
        }),
    updateSubscription: protectedProcedure
        .input(
            z
                .object({
                    subUpdate: z.enum(['toPro', 'toBasic', 'toPlusConference', 'toPlusPhone']),
                }))
        .mutation(async ({ ctx, input }) => {
            const { prisma, stripe } = ctx;

            const userSubscriptionPlan = await getUserSubscriptionDetails({
                prisma,
                userId: ctx.session.user?.id
            })

            if (!userSubscriptionPlan) {
                throw new Error("Could not get subscription data from database");
            }

            const subscription = await stripe.subscriptions.retrieve(userSubscriptionPlan.stripeSubscriptionId);

            if (subscription.cancel_at_period_end === true) {
                throw new TRPCError({
                    code: 'PRECONDITION_FAILED',
                    message: 'Subscription must not be cancelled in order to update it.',
                });
            }

            const existingSubscriptionItemPrice = subscription.items.data[0]?.id;

            const updatedItem = {
                price: "",
                quantity: 1,
            }

            switch (input.subUpdate) {
                case "toPro":
                    updatedItem.price = env.STRIPE_PRO_MONTHLY_PLAN_ID;
                    break;
                case "toPlusConference":
                    updatedItem.price = env.STRIPE_PLUS_CONFERENCE_MONTHLY_PLAN_ID;
                    break;
                case "toPlusPhone":
                    updatedItem.price = env.STRIPE_PLUS_PHONE_MONTHLY_PLAN_ID;
                    break;
                case "toBasic":
                    updatedItem.price = env.STRIPE_BASIC_MONTHLY_PLAN_ID;
                    break;
                default:
                    throw new Error("No subUpdate matches any case in checkout route");
            }

            stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: false,
                proration_behavior: 'always_invoice',
                items: [
                {
                    id: existingSubscriptionItemPrice,
                    deleted: true,
                },
                updatedItem ],
            });
        })
});
