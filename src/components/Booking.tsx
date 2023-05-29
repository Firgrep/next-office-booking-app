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

    const rooms: undefined | any[] = api.booking.getRooms.useQuery().data;
    const bookings = api.booking.getRoomBookings.useQuery({
        roomId: room.roomId
    }).data;

    
    console.log("bookings: ", bookings);

    return (
        <section>
            <SelectRooms 
                rooms={rooms}
                setRoom={setRoom}
            />
            {bookings ? (
            <>
                <div className="bg-sky-500">{room.roomId}</div>
                <Calendar 
                    // !TODO pass bookings into calendar and build display of existing bookings
                    date={date}
                    setDate={setDate}
                />
            </>
            ) : (<div style={{height: "500px"}}></div>)}
        </section>
    );
};