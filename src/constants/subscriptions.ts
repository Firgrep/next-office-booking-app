import { env } from "~/env.mjs"
import { type SubscriptionPlan } from "~/types"


export const proPlan: SubscriptionPlan = {
    name: "Pro Plan",
    description: "The Pro plan allows for unlimited use of community space and includes booking.",
    stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}

export const plusPlanConference: SubscriptionPlan = {
    name: "Plus Plan (Conference Room)",
    description: "Includes free usage of communal space and free booking of conference room (capped).",
    stripePriceId: env.STRIPE_PLUS_CONFERENCE_MONTHLY_PLAN_ID || "",
}

export const plusPlanPhone: SubscriptionPlan = {
    name: "Plus Plan (Phone Booths)",
    description: "Includes free usage of the communal room along with free booking of the phone booths (capped).",
    stripePriceId: env.STRIPE_PLUS_PHONE_MONTHLY_PLAN_ID || "",
}

export const basicPlan: SubscriptionPlan = {
    name: "Basic Plan",
    description: "Includes free use of communal office space.",
    stripePriceId: env.STRIPE_BASIC_MONTHLY_PLAN_ID || "",
}

export const flexPayPlan: SubscriptionPlan = {
    name: "Flex Plan",
    description: "The flex plan allows for purchase of bookings. Upgrade to the PRO plan for unlimited use of community space and included booking of conference space.",
    stripePriceId: "",
}