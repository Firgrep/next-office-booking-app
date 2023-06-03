import { useState } from "react";
import { SelectRooms } from "./SelectRooms";
import { Calendar } from "./Calendar";
import { api } from "~/utils/api";
import { format, add } from 'date-fns';
import { useSession } from "next-auth/react";


interface bookingProps {}

export const Booking: React.FC<bookingProps> = () => {
    const { data: sessionData } = useSession();
    const booking = api.booking.createBooking.useMutation();

    const [ date, setDate ] = useState<DateType>({
        justDate: null,
        dateTime: null,
    });
    const [ room, setRoom ] = useState<RoomType>({
        roomId: null
    });

    const rooms: undefined | any[] = api.booking.getRooms.useQuery(undefined, {
        refetchOnWindowFocus: false,
    }).data;

    const bookings: undefined | null | any[] = api.booking.getRoomBookings.useQuery({
        roomId: room.roomId
    }, {
        refetchOnWindowFocus: false,
    }).data;


    const handleBooking = (startTime: Date ) => {
        if (!sessionData) {
            console.log("No session data");
            return;
        };
        if (!room?.roomId) {
            console.log("No room ID selected");
            return;
        }

        const selectedRoom = rooms?.find(roomToCheck => roomToCheck.id === room.roomId)

        if (!selectedRoom) {
            console.log("Failed to find selected room");
            return;
        }

        const endTime = add(startTime, {minutes: selectedRoom.interval})

        booking.mutate({
            userId: sessionData.user.id,
            startTime: startTime,
            endTime: endTime,
            roomId: room.roomId,
        });
    }


    return (
        <section className="flex flex-col items-start w-full">
            <SelectRooms 
                rooms={rooms}
                setRoom={setRoom}
                setDate={setDate}
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

            {date.dateTime ? (
                <div className="flex flex-col justify-center items-center mt-5 min-h-[200px] w-full">
                    <p className="bg-gray-100 p-5 m-5 text-center">You have chosen a {rooms?.find(roomToCheck => roomToCheck.id === room.roomId).interval}-min booking at the time <br></br> {format(date.dateTime, `EEEE kk:mm, MMM, yyyy`)}</p>
                    <button 
                        className="btn btn-primary" 
                        type="button" 
                        onClick={() => date.dateTime ? handleBooking(date.dateTime) : console.log("Datetime null")}
                        disabled={booking.isLoading}
                    >
                        Book
                    </button>
                    {booking.isSuccess && <p className="bg-green-500">Success! Successfully booked!</p>}
                    {booking.error && <p className="bg-red-500 p-5">Oops! Something went wrong! {booking.error.message}</p>}
                </div>
            ) : (<div style={{height: "200px"}}></div>)}
        </section>
    );
};
