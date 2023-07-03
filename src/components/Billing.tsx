"use client"

import { type UserSubscriptionPlan } from "~/types";
import { BtnManageBilling } from "./BtnManageBilling";
import { BtnSubscriptionCheckout } from "./BtnSubscriptionCheckout";
import { BtnUpdateSubscription } from "./BtnUpdateSubscription";
import { PeriodEndDisplay } from "./PeriodEndDisplay";
import { SubTier, UpdateSubTier } from "../constants/client/subscriptionTiers";
import { Alert } from "./Alert";

interface BillingProps extends React.HTMLAttributes<HTMLFormElement> {
    userSubscriptionPlan: UserSubscriptionPlan & {
        isCanceled: boolean
    };
}

/**
 * Container component for billing-related logic. Renders appropriate components based on
 * user subscription tier or unsubscribed. 
 * @param userSubscriptionPlan - this prop also includes isCanceled boolean.
 */
export const Billing: React.FC<BillingProps> = ({
    userSubscriptionPlan,
}) => {
    const upgradeSubString = "To upgrade your subscription, please renew it first."

    if (userSubscriptionPlan.isPro) {
        return(
            <>
                <h2>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnManageBilling />
                <PeriodEndDisplay 
                    isCanceled={userSubscriptionPlan.isCanceled}
                    stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                />
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} />
                ) : (
                    <>
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusConference}
                            btnText="Downgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusPhone}
                            btnText="Downgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toBasic}
                            btnText="Downgrade to"
                        />
                    </>
                )}
            </>
        );
    } else if (userSubscriptionPlan.isPlusConference) {
        return(
            <>
                <h2>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnManageBilling />
                <PeriodEndDisplay 
                    isCanceled={userSubscriptionPlan.isCanceled}
                    stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                />
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} />
                ) : (
                    <>
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPro}
                            btnText="Upgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusPhone}
                            btnText="Change to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toBasic}
                            btnText="Downgrade to"
                        />
                    </>
                )}
            </>
        );
    } else if (userSubscriptionPlan.isPlusPhone) {
        return(
            <>
                <h2>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnManageBilling />
                <PeriodEndDisplay 
                    isCanceled={userSubscriptionPlan.isCanceled}
                    stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                />
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} />
                ) : (
                    <>
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPro}
                            btnText="Upgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusConference}
                            btnText="Change to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toBasic}
                            btnText="Downgrade to"
                        />
                    </>
                )}
            </>
        );
    } else if (userSubscriptionPlan.isPlusConference) {
        return(
            <>
                <h2>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnManageBilling />
                <PeriodEndDisplay 
                    isCanceled={userSubscriptionPlan.isCanceled}
                    stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                />
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} />
                ) : (
                    <>
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPro}
                            btnText="Upgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusPhone}
                            btnText="Change to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toBasic}
                            btnText="Downgrade to"
                        />
                    </>
                )}
            </>
        );
    } else if (userSubscriptionPlan.isBasic) {
        return(
            <>
                <h2>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnManageBilling />
                <PeriodEndDisplay 
                    isCanceled={userSubscriptionPlan.isCanceled}
                    stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                />
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} />
                ) : (
                    <>
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPro}
                            btnText="Upgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusConference}
                            btnText="Upgrade to"
                        />
                        <BtnUpdateSubscription
                            subTierToUpdate={UpdateSubTier.toPlusPhone}
                            btnText="Upgrade to"
                        />
                    </>
                )}
            </>
        );
    } else {
        return(
            <>
                <h2>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnSubscriptionCheckout
                    subTier={SubTier.pro}
                />
                <BtnSubscriptionCheckout
                    subTier={SubTier.plusConference}
                />
                <BtnSubscriptionCheckout
                    subTier={SubTier.plusPhone}
                />
                <BtnSubscriptionCheckout
                    subTier={SubTier.basic}
                />
            </>
        );
    }
}


// const { mutateAsync: createStripeSession } = api.stripe.createBillingOrCheckoutSession.useMutation({
    //     onSuccess() {
        //         utils.stripe.invalidate();
        //     }
        // });
        
        // async function onSubmit(event: React.FormEvent) {
            //     event.preventDefault();
            //     setIsLoading(!isLoading);
            
            //     const { url } = await createStripeSession();
            
            //     if (!url) {
                //         return console.log("Error: no URL");
                //     }
                
                //     if (url) {
                    //         window.location.href = url;
                    //     }
                    // }

// return (
//     <section className="bg-green-500" >
//         <h3>Billing form</h3>
//         <p>{userSubscriptionPlan.description}</p>

//         <button
//             type="submit"
//             className="btn"
//             disabled={isLoading}   
//         >
//             {isLoading && (
//                 <p className="animate-spin">Ø</p>
//             )}
//             {userSubscriptionPlan.isPro ? "Manage Subscription" : "Upgrade to PRO"}
//         </button>
//         {userSubscriptionPlan.isPro ? (
//             <p className="rounded-full text-xs font-medium">
//                 {userSubscriptionPlan.isCanceled 
//                     ? "Your plan will be canceled on "
//                     : "Your plan renews on "}
//                 {formatDate(userSubscriptionPlan.stripeCurrentPeriodEnd)}.
//             </p>
//         ) : null}
//     </section>
// );