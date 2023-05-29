import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";

export const bookingRouter = createTRPCRouter({
    getRooms: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.room.findMany();
    })
    // book: publicProcedure
    //     .input(z.object({ roomId: z.string() }))
    //     .query(({ ctx }) => {
    //         return ctx.prisma.booking.create({
    //             data: {
                    
    //             }
    //         })
    //     })
})