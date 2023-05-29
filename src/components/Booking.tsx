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
        roomId: null
    })

    const rooms = api.booking.getRooms.useQuery().data;
    console.log(rooms);

    return (
        <section>
            <SelectRooms 
                rooms={rooms}
                setRoom={setRoom}
            />
            {room.roomId && <div className="">{room.roomId}</div>}
            <Calendar 
                date={date}
                setDate={setDate}
            />
        </section>
    );
};