import { z } from "zod";
import {
    createTRPCRouter,
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
import {
    CONFERENCE_ROOM_ID,
    PHONE_BOOTH_A_ID,
    PHONE_BOOTH_B_ID
} from "../../../constants/client/rooms";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe/stripeWebhookHandlers";
import { env } from "~/env.mjs";
import type { SubscriptionPlan, UserSubscriptionPlan } from "~/types";
import { type PrismaClient } from "@prisma/client";
import { type NextApiRequest } from "next/types";
import { SESSION_EXPIRY_TIME } from "~/constants/server/purchaseConfig";


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
            return await getUserSubscriptionDetails({ prisma: ctx.prisma, userId: ctx.session.user.id});
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
    createBillingSession: protectedProcedure
        .mutation(async ({ ctx }) => {
            const baseUrl = getBaseUrl(ctx.req);
            const userSubscriptionPlan = await getUserSubscriptionDetails({ prisma: ctx.prisma, userId: ctx.session.user.id});
            
            if (checkUserSubscriptionPlan(userSubscriptionPlan) && userSubscriptionPlan.stripeCustomerId) {
                const stripeSession = await ctx.stripe.billingPortal.sessions.create({
                    // ! fix this linting issue
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

            // ! fix linting issue
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

            await stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: false,
                proration_behavior: 'always_invoice',
                items: [
                {
                    id: existingSubscriptionItemPrice,
                    deleted: true,
                },
                updatedItem ],
            });
        }),
    createBookingPurchaseCheckoutSession: protectedProcedure
        .input(z.object({ roomId: z.string(), startTime: z.date(), endTime: z.date(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Preliminary Setup
            const baseUrl = getBaseUrl(ctx.req);
            const { prisma, stripe } = ctx;

            // Create booking
            const booking = await ctx.prisma.booking.create({
                data: {
                    roomId: input.roomId,
                    startTime: input.startTime,
                    endTime: input.endTime, 
                    userId: input.userId
                }
            });
            console.log("ROUTE: Booking created...");

            // TODO add check if user is authorized to book this

            // Setup Stripe purchase product
            const purchase = {
                price: "",
                quantity: 1,
            }

            switch (input.roomId) {
                case CONFERENCE_ROOM_ID:
                    purchase.price = env.STRIPE_CONFERENCE_ROOM_ID
                    break;
                case PHONE_BOOTH_A_ID:
                    purchase.price = env.STRIPE_PHONE_BOOTH_ID
                    break;
                case PHONE_BOOTH_B_ID:
                    purchase.price = env.STRIPE_PHONE_BOOTH_ID
                    break;
                default:
                    throw new Error("No room matches any product case in checkout route");
            }
            
            // Get or create Stripe customer
            const customerId = await getOrCreateStripeCustomerIdForUser({
                prisma,
                stripe,
                userId: ctx.session.user.id
            })

            if (!customerId) {
                throw new Error("Could not create customer");
            }

            // Create Stripe session
            const expirationTimestamp = Math.floor(Date.now() / 1000) + SESSION_EXPIRY_TIME;

            const stripeSession = await ctx.stripe.checkout.sessions.create({
                customer: customerId,
                client_reference_id: ctx.session.user?.id,
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [ purchase ],
                success_url: `${baseUrl}/account/booking?status=success`,
                cancel_url: `${baseUrl}/account/booking?status=canceled`,
                metadata: {
                    userId: ctx.session.user?.id,
                },
                expires_at: expirationTimestamp
            });

            if (!stripeSession) {
                throw new Error("Could not create checkout session");
            }

            // Store Stripe Session ID attached to present user and this booking
            await ctx.prisma.pendingStripeSession.create({
                data: {
                    stripeSession: stripeSession.id,
                    userId: ctx.session.user.id,
                    bookingId: booking.id
                }
            });

            return { url: stripeSession.url };
        }),
    // createSessionResume: protectedProcedure
    //     .mutation(async ({ ctx }) => {

    //         const pendingStripeSessionRecord = await ctx.prisma.pendingStripeSession.findUnique({
    //             where: {
    //                 userId: ctx.session.user.id,
    //             }
    //         })

    //         if (!pendingStripeSessionRecord) {
    //             return undefined;
    //         }

    //         const session = await ctx.stripe.checkout.sessions.retrieve(
    //             pendingStripeSessionRecord.stripeSession
    //         );

    //         if (!session) {
    //             throw new Error("Could not create retrieve checkout session");
    //         }

    //         return { url: session.url };
    //     })
});
