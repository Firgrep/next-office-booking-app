import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { flexPayPlan, proPlan } from "~/constants/subscriptions";


export const subscriptionRouter = createTRPCRouter({
    getUserSubscriptionPlan: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.prisma.user.findFirst({
                where: {
                    id: ctx.session?.user.id,
                },
                select: {
                    stripeCustomerId: true,
                    stripeSubscriptionId: true,
                    stripePriceId: true,
                    stripeCurrentPeriodEnd: true,
                }
            })

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
            }
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
                return null;
            }

            const stripePlan = await ctx.stripe.subscriptions.retrieve(
                input.stripeSubscriptionId
            );
            return stripePlan.cancel_at_period_end;
        })
})