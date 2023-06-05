import { useState, useEffect } from "react";
import { SelectRooms } from "./SelectRooms";
import { Calendar } from "./Calendar";
import { api } from "~/utils/api";
import { format, add } from 'date-fns';
import { useSession } from "next-auth/react";


interface bookingProps {}

export const Booking: React.FC<bookingProps> = () => {
    const { data: sessionData } = useSession();
    const utils = api.useContext();
    const { data: rooms } = api.booking.getRooms.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    const [ date, setDate ] = useState<DateType>({
        justDate: null,
        dateTime: null,
    });
    const [ room, setRoom ] = useState<RoomType>({
        roomId: null
    });

    const bookings: undefined | null | any[] = api.booking.getRoomBookings.useQuery({
        roomId: room.roomId
    }, {
        refetchOnWindowFocus: false,
    }).data;

    const booking = api.booking.createBooking.useMutation({
        onSuccess() {
            utils.booking.invalidate();
        }
    });

    // const createBookingMutation = useMutation('createBooking', {
    //     async run(input) {
    //         return api.booking.createBooking(input);
    //     },
    //     onSuccess() {
            
    //     },
    // });

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

        setDate((prev) => ({ ...prev, dateTime: null}));
    };

    useEffect(() => {
        if (booking.isSuccess) {
            const handleClick = () => {
                booking.reset();
            }
            window.addEventListener("click", () => {
                handleClick();
            });
            return () => {
                window.removeEventListener("click", () => {
                    handleClick();
                });
            };
        }
    }, [booking.isSuccess]);


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

            {booking.isSuccess && <p className="bg-green-500">Success! Successfully booked!</p>}   

            {date.dateTime ? (
                <div className="flex flex-col justify-center items-center mt-5 min-h-[200px] w-full">
                    <p className="bg-gray-100 p-5 m-5 text-center">
                        You have chosen a {rooms && rooms?.find(roomToCheck => roomToCheck.id === room.roomId)?.interval || <span>Error_in_booking_comp</span>}-min booking at the time 
                        <br></br> 
                        {format(date.dateTime, `EEEE kk:mm, MMM, yyyy`)}
                    </p>
                    <button 
                        className="btn btn-primary" 
                        type="button" 
                        onClick={() => date.dateTime ? handleBooking(date.dateTime) : console.log("Datetime null")}
                        disabled={booking.isLoading}
                    >
                        Book
                    </button>
                    {booking.error && <p className="bg-red-500 p-5">Oops! Something went wrong! {booking.error.message}</p>}
                </div>
            ) : (<div style={{height: "200px"}}></div>)}
        </section>
    );
};
