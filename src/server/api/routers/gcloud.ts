import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createHttpTaskWithToken } from "~/server/gcloud/cloudTasks";

// ! test only
// TODO delete router after testing
export const gcloudRouter = createTRPCRouter({
    task: publicProcedure
        .mutation(() => {
            createHttpTaskWithToken().catch(console.error);
            return;
        }),
});
