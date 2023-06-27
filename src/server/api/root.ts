import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { bookingRouter } from "./routers/booking";
import { stripeRouter } from "./routers/stripe";
import { gcloudRouter } from "./routers/gcloud";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  booking: bookingRouter,
  stripe: stripeRouter,
  gcloud: gcloudRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
