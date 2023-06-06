import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';

export const bookingRouter = createTRPCRouter({
    getRooms: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.room.findMany();
    }),
    getRoomBookings: publicProcedure
        .input(z.object({ roomId: z.string().nullish() }).nullish())
        .query(({ ctx, input }) => {
            return input?.roomId ? (ctx.prisma.booking.findMany({
                where: {
                    roomId: input?.roomId,
                    startTime: {gte: new Date()},
                }
            })) : (null);
        }),
    createBooking: publicProcedure
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
    deleteBooking: publicProcedure
        .input(z.object({ bookingId: z.string(), bookingUserId: z.string() }))
        .mutation(({ ctx, input }) => {
            if (ctx.session?.user.id !== input.bookingUserId) {
                console.log("CTX User ID does not match booking User ID");
                throw new TRPCError({ 
                    code: 'BAD_REQUEST',
                    message: 'Logged user ID does not match User ID on target booking',
                });
            }
            return ctx.prisma.booking.delete({
                where: {
                    id: input.bookingId,
                }
            });
        }),
})