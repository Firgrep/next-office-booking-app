
interface CardOfferingsProps {
    title: string,
    text: string,
}

export const CardOfferings: React.FC<CardOfferingsProps> = ({ title, text}) => {

    return (
        <div className="border-custom-black border-[1px] p-2">
            <div className="flex justify-center items-stretch">
                <div className="flex items-start w-[200px] mr-6 mt-2 md:mt-6">
                    <img 
                        src="/static/images/conference-room.jpg"
                        alt="conference room"
                        className="object-cover w-full h-auto"
                    ></img>
                </div>
                <div className="min-w-sm">
                <h4 className="text-xl font-bold">{title}</h4>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}