"use client"

import { type UserSubscriptionPlan } from "~/types";
import { BtnManageBilling } from "./BtnManageBilling";
import { BtnSubscriptionCheckout } from "./BtnSubscriptionCheckout";
import { BtnUpdateSubscription } from "./BtnUpdateSubscription";
import { PeriodEndDisplay } from "./PeriodEndDisplay";
import { SubTier, UpdateSubTier } from "../constants/client/subscriptionTiers";
import { Alert } from "./Alert";
import { CardProduct } from "./CardProduct";
import { cardsConfig } from "~/constants/client/cards";


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
    // Content for page
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
    const subPlanTitleFragment = "rounded-md bg-gradient-to-r from-custom-lightpink to-violet-300 px-2 pb-1"
    const subPlanDescription = "mt-2 text-custom-brown text-lg"
    const profileHeaderInterior = "flex mt-4 justify-between items-end"

    const profileSecondBox = "mt-12 mb-64 flex flex-col w-full gap-8"
    const upgradeCardBase = "w-full p-4 shadow-xl rounded-md"
    const upgradeCardDescription = "text-slate-300 text-xl py-2"
    const upgradeCardTitle = "text-xl text-white flex justify-between"

    const upgradeCardToPro = `${upgradeCardBase} bg-gradient-to-r from-slate-800 to-slate-600 hover:to-amber-500`
    const upgradeCardToPlusConference = `${upgradeCardBase} bg-gradient-to-r from-slate-600 to-slate-500 hover:to-emerald-600`
    const upgradeCardToPlusPhone = `${upgradeCardBase} bg-gradient-to-r from-slate-600 to-slate-500 hover:to-pink-600`
    const upgradeCardToBasic = `${upgradeCardBase} bg-gradient-to-r from-slate-500 to-slate-400 hover:to-blue-600`

    // The control flow is a simple if / else if / else that determines the user "profile"
    // 
    // |--- IF subscription-is-pro
    // |    |--- render UI profile for pro
    // |
    // |--- ELSE IF subscription-is-plus-phone
    // |    |--- render UI profile for plus-phone
    // |
    // |--- ELSE IF subscription-is-plus-conference
    // |    |--- render UI profile for plus-conference
    // |
    // |--- ELSE IF subscription-is-basic
    // |    |--- render UI profile for basic
    // |
    // |--- ELSE
    // |    |--- render UI profile for flexpay

    if (userSubscriptionPlan.isPro) {
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
                            <div className={upgradeCardToPlusConference}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusConference}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusConference}</p>
                                <CardProduct 
                                    data={cardsConfig.conference}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                            subTierToUpdate={UpdateSubTier.toPlusConference}
                                            btnText="Downgrade to"
                                        />
                                </CardProduct>
                            </div>

                            <div className={upgradeCardToPlusPhone}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusPhone}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusPhone}</p>
                                <CardProduct 
                                    data={cardsConfig.phone}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPlusPhone}
                                        btnText="Downgrade to"
                                    />
                                </CardProduct>
                            </div>

                            <div className={upgradeCardToBasic}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToBasic}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToBasic}</p>
                                <CardProduct 
                                    data={cardsConfig.basic}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toBasic}
                                        btnText="Downgrade to"
                                    />
                                </CardProduct>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else if (userSubscriptionPlan.isPlusPhone) {
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

                            <div className={upgradeCardToPro}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPro}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPro}</p>
                                <CardProduct 
                                    data={cardsConfig.pro}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPro}
                                        btnText="Upgrade to"
                                    />
                                </CardProduct>
                            </div>

                            <div className={upgradeCardToPlusConference}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusConference}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusConference}</p>
                                <CardProduct 
                                    data={cardsConfig.conference}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPlusConference}
                                        btnText="Change to"
                                    />
                                </CardProduct>
                            </div>

                            <div className={upgradeCardToBasic}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToBasic}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToBasic}</p>
                                <CardProduct 
                                    data={cardsConfig.basic}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toBasic}
                                        btnText="Downgrade to"
                                    />
                                </CardProduct>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    } else if (userSubscriptionPlan.isPlusConference) {
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

                            <div className={upgradeCardToPro}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPro}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPro}</p>
                                <CardProduct 
                                    data={cardsConfig.pro}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPro}
                                        btnText="Upgrade to"
                                    />
                                </CardProduct>
                            </div>

                            <div className={upgradeCardToPlusPhone}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusPhone}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusPhone}</p>
                                <CardProduct 
                                    data={cardsConfig.phone}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPlusPhone}
                                        btnText="Change to"
                                    />
                                </CardProduct>
                            </div>
                            
                            <div className={upgradeCardToBasic}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToBasic}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToBasic}</p>
                                <CardProduct 
                                    data={cardsConfig.basic}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toBasic}
                                        btnText="Downgrade to"
                                    />
                                </CardProduct>
                            </div>
                        </>
                    )}
                </div>
            </div>
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

                            <div className={upgradeCardToPro}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPro}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPro}</p>
                                <CardProduct 
                                    data={cardsConfig.pro}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPro}
                                        btnText="Upgrade to"
                                    />
                                </CardProduct>
                            </div>
                            
                            <div className={upgradeCardToPlusConference}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusConference}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusConference}</p>
                                <CardProduct 
                                    data={cardsConfig.conference}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPlusConference}
                                        btnText="Upgrade to"
                                    />
                                </CardProduct>
                            </div>

                            <div className={upgradeCardToPlusPhone}>
                                <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusPhone}</h2>
                                <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusPhone}</p>
                                <CardProduct 
                                    data={cardsConfig.phone}
                                    active={false}
                                    wider={true}
                                >
                                    <BtnUpdateSubscription
                                        subTierToUpdate={UpdateSubTier.toPlusPhone}
                                        btnText="Upgrade to"
                                    />
                                </CardProduct>
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
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToPro}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToPro}</p>
                        <CardProduct 
                            data={cardsConfig.pro}
                            active={false}
                            wider={true}
                        >
                            <BtnSubscriptionCheckout
                                subTier={SubTier.pro}
                            />
                        </CardProduct>
                        
                    </div>
                    
                    <div className={upgradeCardToPlusConference}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusConference}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusConference}</p>
                        <CardProduct 
                            data={cardsConfig.conference}
                            active={false}
                            wider={true}
                        >
                            <BtnSubscriptionCheckout
                                subTier={SubTier.plusConference}
                            />
                        </CardProduct>
                    </div>

                    <div className={upgradeCardToPlusPhone}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToPlusPhone}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToPlusPhone}</p>
                        <CardProduct 
                            data={cardsConfig.phone}
                            active={false}
                            wider={true}
                        >
                            <BtnSubscriptionCheckout
                                subTier={SubTier.plusPhone}
                            />
                        </CardProduct>
                    </div>

                    <div className={upgradeCardToBasic}>
                        <h2 className={upgradeCardTitle}>{upgradeCardTitleToBasic}</h2>
                        <p className={upgradeCardDescription}>{upgradeCardDescriptionToBasic}</p>
                        <CardProduct 
                            data={cardsConfig.basic}
                            active={false}
                            wider={true}
                        >
                            <BtnSubscriptionCheckout
                                subTier={SubTier.basic}
                            />
                        </CardProduct>
                    </div>
                </div>
            </div>
        );
    }
}
