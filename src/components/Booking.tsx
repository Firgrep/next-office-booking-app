import { useState } from "react";
import { SelectRooms } from "./SelectRooms";
import { Calendar } from "./Calendar";
import { api } from "~/utils/api";

interface bookingProps {}

export const Booking: React.FC<bookingProps> = () => {
    const [ date, setDate ] = useState<DateType>({
        justDate: null,
        dateTime: null,
    });
    const [ room, setRoom ] = useState<RoomType>({
        roomId: null,
    });

    const rooms: undefined | any[] = api.booking.getRooms.useQuery(undefined, {
        refetchOnWindowFocus: false,
    }).data;

    const bookings: undefined | null | any[] = api.booking.getRoomBookings.useQuery({
        roomId: room.roomId
    }, {
        refetchOnWindowFocus: false,
    }).data;


    return (
        <section>
            <SelectRooms 
                rooms={rooms}
                setRoom={setRoom}
            />
            {(bookings) ? (
            <>
                <Calendar 
                    bookings={bookings}
                    date={date}
                    setDate={setDate}
                />
            </>
            ) : (<div style={{height: "500px"}}></div>)}
        </section>
    );
};
