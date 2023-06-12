import { env } from "~/env.mjs"
import { type SubscriptionPlan } from "~/types"

export const flexPayPlan: SubscriptionPlan = {
    name: "Flex",
    description:
    "The flex plan allows for purchase of bookings. Upgrade to the PRO plan for unlimited use of community space and included booking of conference space.",
    stripePriceId: "",
}
  
export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "The PRO plan allows for unlimited use of community space and includes booking.",
    stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}
