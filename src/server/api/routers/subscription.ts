import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';

// TODO fix
export const subscriptionRouter = createTRPCRouter({
    getUserSubscriptionPlan: publicProcedure
        .query(({ ctx }) => {
            return ctx.prisma.user.findFirst({
                where: {
                    id: ctx.session?.user.id,
                }
            })
        })
})