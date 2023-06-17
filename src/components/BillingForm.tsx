"use client"

import { useState } from "react";
import { type UserSubscriptionPlan } from "~/types";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/utils";

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
    userSubscriptionPlan: UserSubscriptionPlan & {
        isCanceled: boolean
    }
}

export const BillingForm: React.FC<BillingFormProps> = ({
    userSubscriptionPlan,
}) => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const utils = api.useContext();
    const { mutateAsync: createStripeSession } = api.stripe.createBillingOrCheckoutSession.useMutation({
        onSuccess() {
            utils.stripe.invalidate();
        }
    });

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(!isLoading);

        const { url } = await createStripeSession();

        if (!url) {
            return console.log("Error: no URL");
        }

        if (url) {
            window.location.href = url;
        }
    }
    
    return (
        <form className="bg-green-500" onSubmit={onSubmit} >
            <h3>Billing form</h3>
            <p>{userSubscriptionPlan.description}</p>

            <button
                type="submit"
                className="btn"
                disabled={isLoading}   
            >
                {isLoading && (
                    <p className="animate-spin">Ø</p>
                )}
                {userSubscriptionPlan.isPro ? "Manage Subscription" : "Upgrade to PRO"}
            </button>
            {userSubscriptionPlan.isPro ? (
                <p className="rounded-full text-xs font-medium">
                    {userSubscriptionPlan.isCanceled 
                        ? "Your plan will be canceled on "
                        : "Your plan renews on "}
                    {formatDate(userSubscriptionPlan.stripeCurrentPeriodEnd)}.
                </p>
            ) : null}
        </form>
    );
};
