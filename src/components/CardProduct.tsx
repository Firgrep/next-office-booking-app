import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ICON_SIZE_SM } from "~/constants/client/site"
import { SubTier } from "~/constants/client/subscriptionTiers";


interface CardProps {
    title: string,
    badgeText?: string,
    description: string,
    bulletPoints?: string[],
    priceTag?: string,
    imgUrl?: string,
    wider?: boolean,
    priceDescription?: string,
    purchaseTier?: SubTier,
    purchaseBtnDescription?: string,
    active?: boolean
}

export const CardProduct: React.FC<CardProps> = ({
    title, 
    badgeText, 
    description, 
    bulletPoints = [], 
    priceTag,
    imgUrl,
    wider,
    priceDescription = "Billed monthly. Cancel anytime.",
    purchaseTier,
    purchaseBtnDescription = "Buy Now",
    active = true,
}) => {
    const { data: session } = useSession();
    const router = useRouter();

    // To make it a bit easier, the user is sent to the billing page (if logged)
    // or to the login page.
    const purchaseHandler = () => {
        if (session) {
            void router.push("/account/billing")
        } else {
            void router.push("/login")
        }
    }
    // ${size}
    return (
        <div className={`card w-52 sm:w-64 ${wider ? "md:w-96" : "md:w-80"} bg-white border-2 border-custom-brown shadow-[0px_0px_24px_8px_rgba(254,190,_107,_0.4)]`}>
            {imgUrl && <figure><img src={imgUrl} alt="conference room"></img></figure>}
            <div className="card-body">
                <h2 className="card-title grow-0">
                    <span className="text-custom-black">{title}</span>
                    {badgeText && <div className="badge badge-secondary">{badgeText}</div>}
                </h2>
                <p className="grow-0 text-custom-black">{description}</p>
                <span className="border-t my-1"></span>
                <ul className="flex grow flex-col gap-4">
                    {bulletPoints.map((point, index) => {
                        return (
                            <li key={index} className="flex">
                                <img 
                                    src="/static/svg/check-svgrepo-com.svg" 
                                    alt="check"
                                    style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                ></img>
                                <span className="text-gray-500">{point}</span>
                            </li>
                        );
                    })}
                </ul>
                { priceTag &&
                <div className="bg-custom-gray rounded-md p-4">
                    <p className="text-lg text-black">£<span className="text-4xl font-bold">{priceTag}</span>&nbsp;/month</p>
                    <p className="text-sm text-gray-500 mt-2">{priceDescription}</p>
                </div>}
                <div className="card-actions justify-end">
                    { active &&
                    <button 
                        className="btn btn-primary"
                        onClick={purchaseHandler}
                    >{purchaseBtnDescription}</button>}
                </div>
            </div>
        </div>
    )
}
