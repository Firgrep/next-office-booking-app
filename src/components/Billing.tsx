"use client"

import { useState } from "react";
import { type UserSubscriptionPlan } from "~/types";
import { api } from "~/utils/api";
import { formatDate } from "~/utils/utils";


const BtnManageBilling: React.FC = () => {
    const utils = api.useContext();
    const { isLoading: billingIsLoading, mutateAsync: manageBillingProcedure } = api.stripe.createBillingSession.useMutation();

    return(
        <button
            className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
            onClick={async () => {
                const { url } = await manageBillingProcedure();
                if (!url) {
                    return console.log("Error: no URL");
                }
                if (url) {
                    window.location.href = url;
                }
            }}
            disabled={billingIsLoading}
        >
            Manage Billing
        </button>
    );
};

enum SubTier {
    pro = 'pro',
    plusConference = 'plusConference',
    plusPhone = 'plusPhone',
    basic = 'basic',
}

interface BtnSubscriptionCheckoutProps {
    subTier: SubTier
}

const BtnSubscriptionCheckout: React.FC<BtnSubscriptionCheckoutProps> = ({ subTier }) => {
    const utils = api.useContext();
    const { isLoading: checkoutIsLoading, mutateAsync: checkoutSubscriptionProcedure } = api.stripe.createSubscriptionCheckoutSession.useMutation({
        onSuccess() {
            utils.stripe.getUserSubscriptionPlan.invalidate();
            utils.stripe.checkUserStripeCancellation.invalidate();
        }
    });

    return(
        <button
            className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
            onClick={async () => {
                const { url } = await checkoutSubscriptionProcedure({subTier: subTier});
                if (!url) {
                    return console.log("Error: no URL");
                }
                if (url) {
                    window.location.href = url;
                }
            }}
            disabled={checkoutIsLoading}
        >
            Purchase {subTier}
        </button>
    );
};

enum UpdateSubTier {
    toPro = 'toPro',
    toPlusConference = 'toPlusConference',
    toPlusPhone = 'toPlusPhone',
    toBasic = 'toBasic',
}

interface BtnUpdateSubscriptionProps {
    subTierToUpdate: UpdateSubTier
    btnText: string
}

const BtnUpdateSubscription: React.FC<BtnUpdateSubscriptionProps> = ({ subTierToUpdate, btnText }) => {
    const utils = api.useContext();
    const { isLoading: updateIsLoading, mutateAsync: updateSubscriptionProcedure } = api.stripe.updateSubscription.useMutation({
        onSuccess() {
            utils.stripe.getUserSubscriptionPlan.invalidate();
            utils.stripe.checkUserStripeCancellation.invalidate();
        }
    })

    return (
        <button
            className="w-fit cursor-pointer rounded-md bg-blue-500 px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-blue-600"
            onClick={async () => {
                await updateSubscriptionProcedure({subUpdate: subTierToUpdate});
            }}
            disabled={updateIsLoading}
        >
            {btnText}&nbsp;{subTierToUpdate}
        </button>
    );
};

interface PeriodEndDisplayProps {
    isCanceled: boolean;
    stripeCurrentPeriodEnd: number | undefined;
}

const PeriodEndDisplay: React.FC<PeriodEndDisplayProps> = ({isCanceled, stripeCurrentPeriodEnd}) => {

    return (
        <p className="rounded-full text-xs font-medium">
        {isCanceled 
            ? "Your plan will be canceled on "
            : "Your plan renews on "}
        {formatDate(stripeCurrentPeriodEnd)}.
        </p>
    );
};

interface BillingProps extends React.HTMLAttributes<HTMLFormElement> {
    userSubscriptionPlan: UserSubscriptionPlan & {
        isCanceled: boolean
    }
}

export const Billing: React.FC<BillingProps> = ({
    userSubscriptionPlan,
}) => {
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
};


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