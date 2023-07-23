import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { REFUND_TIME_LIMIT_SHORTER } from "~/constants/client/site";
import { createStripeRefund } from "~/server/stripe/stripeServerSideHandlers";

export const bookingRouter = createTRPCRouter({
    getRooms: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.room.findMany();
    }),
    getRoomBookings: protectedProcedure
        .input(z.object({ roomId: z.string().nullish() }).nullish())
        .query(({ ctx, input }) => {
            return input?.roomId ? (ctx.prisma.booking.findMany({
                where: {
                    roomId: input?.roomId,
                    startTime: {gte: new Date()},
                }
            })) : (null);
        }),
    getUserBookings: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.booking.findMany({
                where: {
                    userId: ctx.session.user.id,
                    startTime: {gte: new Date()},
                }
            });
        }),
    createBooking: protectedProcedure
        .input(z.object({ roomId: z.string(), startTime: z.date(), endTime: z.date(), userId: z.string() }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.booking.create({
                data: {
                    roomId: input.roomId,
                    startTime: input.startTime,
                    endTime: input.endTime, 
                    userId: input.userId
                }
            });
        }),
    deleteBooking: protectedProcedure
        .input(z.object({ bookingId: z.string(), bookingUserId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // TODO this check is likely a redundancy
            if (ctx.session?.user.id !== input.bookingUserId) {
                console.log("CTX User ID does not match booking User ID");
                throw new TRPCError({ 
                    code: 'BAD_REQUEST',
                    message: 'Logged user ID does not match User ID on target booking',
                });
            }
            // TODO implement refund procedure here
            const purchasedBooking = await ctx.prisma.booking.findFirst({
                where: {
                    AND: [
                        {
                            id: input.bookingId,
                        },
                        {
                            paymentIntentId: {
                                not: {
                                    equals: null,
                                }
                            }
                        }
                    ]
                }
            });
            
            console.log("===> PURCHASED BOOKING\n", purchasedBooking);
            if (
                purchasedBooking && 
                purchasedBooking.paymentIntentId &&
                (purchasedBooking.startTime.getTime() - new Date().getTime()) > REFUND_TIME_LIMIT_SHORTER
            ) {
                console.log("===> Condition fires!!");
                const refund = await createStripeRefund({paymentIntentId: purchasedBooking.paymentIntentId, stripe: ctx.stripe});
                console.log("==> REFUND OBJECT\n", refund);
            }

            return await ctx.prisma.booking.delete({
                where: {
                    id: input.bookingId,
                }
            });
        }),
})