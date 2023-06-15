// * Types used across front and back in app.

export type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
}

export type UserSubscriptionPlan = SubscriptionPlan & 
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: undefined | number;
        [Key in "isPro" | "isPlusConference" | "isPlusPhone" | "isBasic"]: boolean;
    } & {
        [Key in keyof UserSubscriptionPlan as Exclude<
            Key,
            "isPro" | "isPlusConference" | "isPlusPhone" | "isBasic"
        >]?: UserSubscriptionPlan[Key];
    } & ExclusiveBoolean;

type ExclusiveBoolean =
| { isPro: true; isPlusConference?: false; isPlusPhone?: false; isBasic?: false }
| { isPro?: false; isPlusConference: true; isPlusPhone?: false; isBasic?: false }
| { isPro?: false; isPlusConference?: false; isPlusPhone: true; isBasic?: false }
| { isPro?: false; isPlusConference?: false; isPlusPhone?: false; isBasic: true };


// Original arrangement of boolean properties for type UserSubscriptionPlan
// isPro: boolean;
// isPlusConference: boolean;
// isPlusPhone: boolean;
// isBasic: boolean;