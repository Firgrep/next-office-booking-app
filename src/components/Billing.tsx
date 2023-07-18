"use client"

import { type UserSubscriptionPlan } from "~/types";
import { BtnManageBilling } from "./BtnManageBilling";
import { BtnSubscriptionCheckout } from "./BtnSubscriptionCheckout";
import { BtnUpdateSubscription } from "./BtnUpdateSubscription";
import { PeriodEndDisplay } from "./PeriodEndDisplay";
import { SubTier, UpdateSubTier } from "../constants/client/subscriptionTiers";
import { Alert } from "./Alert";
import { CardProduct } from "./CardProduct";
import { siteConfig } from "~/constants/client/site";


interface BillingProps extends React.HTMLAttributes<HTMLFormElement> {
    userSubscriptionPlan: UserSubscriptionPlan & {
        isCanceled: boolean
    };
}

// interface DialogHTMLElement extends HTMLElement{
//     show: () => void;
//     close: () => void;
// }

/**
 * Container component for billing-related logic. Renders appropriate components based on
 * user subscription tier or unsubscribed. 
 * @param userSubscriptionPlan - this prop also includes isCanceled boolean.
 */
export const Billing: React.FC<BillingProps> = ({
    userSubscriptionPlan,
}) => {
    const upgradeSubString = "To upgrade your subscription, please renew it first."
    const preTitleBlurb = "You are currently on the "
    const upgradeCardTitleToPro = "The Professional"
    const upgradeCardDescriptionToPro = "Optimize your workflow by gaining total access to all booking facilities."
    const upgradeCardTitleToPlusConference = "The Convener"
    const upgradeCardDescriptionToPlusConference = "Schedule the meetings you need instantly."
    const upgradeCardTitleToPlusPhone = "The Handler"
    const upgradeCardDescriptionToPlusPhone = "Be on standby for important calls."
    const upgradeCardTitleToBasic = "The Regular"
    const upgradeCardDescriptionToBasic = "Use the communal office space at your own schedule."


    // Tailwind control for styling
    const profileMainBox = "w-full"
    const profileHeader = "border-2 border-dotted border-slate-600 p-4 rounded-xl"
    const subPlanTitle = "text-xl font-medium text-slate-800"
    const subPlanTitleFragment = "rounded-md bg-gradient-to-r from-sky-300 to-violet-300 px-2 pb-1"
    const subPlanDescription = "mt-2 text-slate-500 text-lg"
    const profileHeaderInterior = "flex mt-4 justify-between items-end"

    const profileSecondBox = "mt-12 mb-64 flex flex-col w-full gap-8"
    const upgradeCardBase = "w-full p-4 shadow-xl rounded-md"
    const upgradeCardDescription = "text-slate-300 text-xl py-2"
    const upgradeCardTitle = "text-xl text-white"

    const upgradeCardToPro = `${upgradeCardBase} bg-gradient-to-r from-slate-800 to-slate-600 hover:to-amber-500`
    const upgradeCardToPlusConference = `${upgradeCardBase} bg-gradient-to-r from-slate-600 to-slate-500 hover:to-emerald-600`
    const upgradeCardToPlusPhone = `${upgradeCardBase} bg-gradient-to-r from-slate-600 to-slate-500 hover:to-pink-600`
    const upgradeCardToBasic = `${upgradeCardBase} bg-gradient-to-r from-slate-500 to-slate-400 hover:to-blue-600`

    // const dialog41 = document.getElementById("d41") as DialogHTMLElement;

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
                    <Alert text={upgradeSubString} dark={true} />
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
                    <Alert text={upgradeSubString} dark={true} />
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
                    <Alert text={upgradeSubString} dark={true} />
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
                <h2 className={subPlanTitle}>{userSubscriptionPlan.name}</h2>
                <p>{userSubscriptionPlan.description}</p>
                <BtnManageBilling />
                <PeriodEndDisplay 
                    isCanceled={userSubscriptionPlan.isCanceled}
                    stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                />
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} dark={true} />
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
            <div className={profileMainBox}>
                <div className={profileHeader}>
                   <h2 className={subPlanTitle}>{preTitleBlurb}
                        <span className={subPlanTitleFragment}>{userSubscriptionPlan.name}</span></h2>
                    <p className={subPlanDescription}>{userSubscriptionPlan.description}</p>
                    <div className={profileHeaderInterior}>
                       <BtnManageBilling />
                        <PeriodEndDisplay 
                            isCanceled={userSubscriptionPlan.isCanceled}
                            stripeCurrentPeriodEnd={userSubscriptionPlan.stripeCurrentPeriodEnd}
                        />  
                    </div>
                </div>
                
                <div className={profileSecondBox}>
                {userSubscriptionPlan.isCanceled ? (
                    <Alert text={upgradeSubString} dark={true} />
                ) : (
                    <>  
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-64">
                                <Alert text="Need more? Or perhaps less? Consider updating your plan!" dark={true} />
                            </div>
                        </div>

                        {/* <dialog id="d41" className="bg-transparent fixed  z-index-20">
                            <CardProduct 
                                title="PRO Plan"
                                description="For serious office workers"
                                imgUrl={siteConfig.imgUrls.businessPeople}
                                badgeText="BEST DEAL"
                                bulletPoints={["Superfast!", "For hardworking workers only!", "Mega ez!"]}
                                priceTag={siteConfig.price.subscriptions.pro}
                                wider={true}
                            />
                            <button onClick={() => dialog41.close()}>Close</button>
                        </dialog> */}

                        <div className={upgradeCardToPro}>
                            <h2 className={upgradeCardTitle}>{upgradeCardTitleToPro}
                                <button 
                                    className="ml-2 badge badge-info"
                                    // onClick={() => dialog41.show()}
                                >Info</button>
                            </h2>
                            <p className={upgradeCardDescription}>{upgradeCardDescriptionToPro}</p>
                            <BtnUpdateSubscription
                                subTierToUpdate={UpdateSubTier.toPro}
                                btnText="Upgrade to"
                            />
                        </div>
                        
                        <div className={upgradeCardToPlusConference}>
                            <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusConference}</h2>
                            <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusConference}</p>
                            <BtnUpdateSubscription
                                subTierToUpdate={UpdateSubTier.toPlusConference}
                                btnText="Upgrade to"
                            />
                        </div>

                        <div className={upgradeCardToPlusPhone}>
                            <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusPhone}</h2>
                            <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusPhone}</p>
                            <BtnUpdateSubscription
                                subTierToUpdate={UpdateSubTier.toPlusPhone}
                                btnText="Upgrade to"
                            />
                        </div>
                    </>
                )}
                </div>
            </div>
        );
    } else {
        return(
            <div className={profileMainBox}>
                <div className={profileHeader}>
                   <h2 className={subPlanTitle}>{preTitleBlurb}
                        <span className={subPlanTitleFragment}>{userSubscriptionPlan.name}</span></h2>
                    <p className={subPlanDescription}>{userSubscriptionPlan.description}</p>
                    <div className={profileHeaderInterior}>
                       
                    </div>
                </div>

                <div className={profileSecondBox}>
                    <div className={upgradeCardToPro}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToPro}
                            <button 
                                className="ml-2 badge badge-info"
                                // onClick={() => dialog41.show()}
                            >Info</button>
                        </h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToPro}</p>
                        <BtnSubscriptionCheckout
                            subTier={SubTier.pro}
                        />
                    </div>
                    
                    <div className={upgradeCardToPlusConference}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusConference}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusConference}</p>
                        <BtnSubscriptionCheckout
                            subTier={SubTier.plusConference}
                        />
                    </div>

                    <div className={upgradeCardToPlusPhone}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusPhone}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusPhone}</p>
                        <BtnSubscriptionCheckout
                            subTier={SubTier.plusPhone}
                        />
                    </div>

                    <div className={upgradeCardToBasic}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToBasic}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToBasic}</p>
                        <BtnSubscriptionCheckout
                            subTier={SubTier.basic}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
