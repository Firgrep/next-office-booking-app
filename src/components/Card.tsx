import { ICON_SIZE_SM } from "~/constants/client/site"

type Cardsizes = "largest" | "normal";

interface CardProps {
    title: string,
    badgeText?: string,
    description: string,
    bulletPoints?: string[],
    priceTag?: string,
    imgUrl?: string,
    size?: Cardsizes,
    priceDescription?: string,
}

export const Card: React.FC<CardProps> = ({
    title, 
    badgeText, 
    description, 
    bulletPoints = [], 
    priceTag,
    imgUrl,
    size = "normal",
    priceDescription = "Billed monthly. Cancel anytime.",
}) => {
    let widthNumber = 80;

    if (size === "largest") {
        widthNumber = 96;
    }

    return (
        <div className={`card w-64 sm:w-${widthNumber} bg-base-100 border-2 border-red-500 shadow-[0px_0px_24px_8px_rgba(255,_215,_0,_0.4)]`}>
            {imgUrl && <figure><img src={imgUrl} alt="conference room"></img></figure>}
            <div className="card-body">
                <h2 className="card-title grow-0">
                    {title}
                    {badgeText && <div className="badge badge-secondary">{badgeText}</div>}
                </h2>
                <p className="grow-0">{description}</p>
                <span className="border-t my-1"></span>
                <ul className="flex grow flex-col gap-4">
                    {bulletPoints.map((point, index) => {
                        return (
                            <li key={index} className="flex">
                                <img 
                                    src="/svg/check-svgrepo-com.svg" 
                                    alt="check"
                                    style={{height: `${ICON_SIZE_SM}px`, width: `${ICON_SIZE_SM}px`}}
                                ></img>
                                <span className="text-gray-500">{point}</span>
                            </li>
                        );
                    })}
                </ul>
                { priceTag &&
                <div className="bg-zinc-100 rounded-md p-4">
                    <p className="text-lg text-black">£<span className="text-4xl font-bold">{priceTag}</span>&nbsp;/month</p>
                    <p className="text-sm text-gray-500 mt-2">{priceDescription}</p>
                </div>}
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    )
}
