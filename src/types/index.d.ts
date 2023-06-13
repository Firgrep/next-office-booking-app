// * Types used across front and back in app.

export type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
}

export type UserSubscriptionPlan = SubscriptionPlan & 
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: undefined | number;
        isPro: boolean;
    }
