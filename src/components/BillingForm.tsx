"use client"

import { useState } from "react";
import { type UserSubscriptionPlan } from "~/types";

interface BillingFormProps {
    userSubscriptionPlan: UserSubscriptionPlan & {
        isCanceled: boolean
    }
}

export const BillingForm: React.FC<BillingFormProps> = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    // TODO build loading, form function, etc
    
    return (
        <form>
            <h3>Subscription Plan</h3>

        </form>
    )
};
