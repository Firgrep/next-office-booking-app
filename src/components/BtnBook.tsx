import { UserSubscriptionPlan } from "~/types";
import { 
    CONFERENCE_ROOM_ID, 
    PHONE_BOOTH_A_ID, 
    PHONE_BOOTH_B_ID
} from "~/constants/client/rooms";


interface BtnBookProps {
    userSubscriptionPlan: UserSubscriptionPlan;
    date: DateType;
    handleCreateBooking: Function;
    createBookingIsLoading: boolean;
    room: RoomType
}

export const BtnBook: React.FC<BtnBookProps> = ({
    userSubscriptionPlan,
    date,
    handleCreateBooking,
    createBookingIsLoading,
    room,
}) => {

    if (
        userSubscriptionPlan?.isPro ||
        (userSubscriptionPlan?.isPlusConference && room.roomId === CONFERENCE_ROOM_ID) ||
        (userSubscriptionPlan?.isPlusPhone && room.roomId === PHONE_BOOTH_A_ID || room.roomId === PHONE_BOOTH_B_ID)
    ) {
        return (
            <button 
                className="btn btn-primary" 
                type="button" 
                onClick={() => date.dateTime ? handleCreateBooking(date.dateTime) : console.log("Datetime null")}
                disabled={createBookingIsLoading}
            >
                Book
            </button>
        );
    }

    return (
        <button
            className="btn btn-primary"
        >
            Purchase Booking
        </button>
    );
};
