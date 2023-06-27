import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createHttpTaskWithToken } from "~/server/cloud-tasks/cloudTasks";


export const gcloudRouter = createTRPCRouter({
    task: publicProcedure
        .mutation(() => {
            createHttpTaskWithToken().catch(console.error);
            return;
        }),
});
