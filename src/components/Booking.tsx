"use client"

import { useState, useEffect } from "react";
import { SelectRooms } from "./SelectRooms";
import { Calendar } from "./Calendar";
import { api } from "~/utils/api";
import { format, add } from 'date-fns';
import { useSession } from "next-auth/react";
import { BtnBook } from "./BtnBook";
import { sleep } from "~/utils/utils";


/**
 * Container component for booking-related logic. Holds the states and handler functions
 * for nested booking components like SelectRooms and Calendar.
 * @description Takes no props. Fetches everything it needs from context-wide hooks and APIs. 
 */
export const Booking: React.FC = () => {
    const { data: sessionData } = useSession();
    const utils = api.useContext();
    const { data: rooms } = api.booking.getRooms.useQuery();
    const { 
        data: userSubscriptionPlan, 
        isLoading: userSubscriptionPlanLoading, 
        isError: userSubscriptionPlanError 
    } = api.stripe.getUserSubscriptionPlan.useQuery();
    
    const [ date, setDate ] = useState<DateType>({
        justDate: null,
        dateTime: null,
    });
    
    const [ room, setRoom ] = useState<RoomType>({
        roomId: null
    });

    const [ isCreateBookingSuccess, setIsCreateBookingSuccess ] = useState<boolean>(false);
    const [ isDeleteBookingSuccess, setIsDeleteBookingSuccess ] = useState<boolean>(false);
    
    const selectedRoom = rooms?.find(roomToCheck => roomToCheck.id === room.roomId);
    
    const { data: bookings } = api.booking.getRoomBookings.useQuery({
        roomId: room.roomId
    });

    const createBooking = api.booking.createBooking.useMutation({
        onSuccess() {
            setIsCreateBookingSuccess(true);
            utils.booking.invalidate();
        }
    });

    const deleteBooking = api.booking.deleteBooking.useMutation({
        onSuccess() {
            setIsDeleteBookingSuccess(true);
            utils.booking.invalidate();
        }
    });

    const handleCreateBooking = async (startTime: Date ) => {
        if (!sessionData) {
            console.log("No session data");
            return;
        };
        if (!room?.roomId) {
            console.log("No room ID selected");
            return;
        }

        // const selectedRoom = rooms?.find(roomToCheck => roomToCheck.id === room.roomId)

        if (!selectedRoom) {
            console.log("Failed to find selected room");
            return;
        }

        const endTime = add(startTime, {minutes: selectedRoom.interval});

        createBooking.mutate({
            userId: sessionData.user.id,
            startTime: startTime,
            endTime: endTime,
            roomId: room.roomId,
        });

        await sleep(1000);
        setDate((prev) => ({ ...prev, dateTime: null}));
    };

    const handleDeleteBooking = (bookingStartTime: Date) => {
        const booking = bookings?.find(booking => 
            booking.startTime.getFullYear() === bookingStartTime.getFullYear() &&
            booking.startTime.getMonth() === bookingStartTime.getMonth() &&
            booking.startTime.getDate() === bookingStartTime.getDate() &&
            booking.startTime.getHours() === bookingStartTime.getHours() &&
            booking.startTime.getMinutes() === bookingStartTime.getMinutes()
        );

        if (!booking) {
            console.log("No booking found in handleDeleteBooking");
            return;
        }
        
        try {
            deleteBooking.mutate({
                bookingId: booking.id,
                bookingUserId: booking.userId,
            });
        } catch (error: any) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (isCreateBookingSuccess) {
            const handleCreateBookingClick = () => {
                setIsCreateBookingSuccess(false);
            }
            window.addEventListener("click", () => {
                handleCreateBookingClick();
            });
            return () => {
                window.removeEventListener("click", () => {
                    handleCreateBookingClick();
                });
            };
        }
    }, [isCreateBookingSuccess]);

    useEffect(() => {
        if (isDeleteBookingSuccess) {
            const handleDeleteBookingClick = () => {
                setIsDeleteBookingSuccess(false);
            }
            window.addEventListener("click", () => {
                handleDeleteBookingClick();
            });
            return () => {
                window.removeEventListener("click", () => {
                    handleDeleteBookingClick();
                });
            };
        }
    }, [isDeleteBookingSuccess]);


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
                    selectedRoom={selectedRoom}
                    bookings={bookings}
                    date={date}
                    setDate={setDate}
                    handleDeleteBooking={handleDeleteBooking}
                />
            </>
            ) : (<div style={{height: "500px"}}></div>)}

            {isCreateBookingSuccess && <p className="bg-green-500">Success! Successfully booked!</p>}   
            {isDeleteBookingSuccess && <p className="bg-green-500">Success! Booking successfully cancelled.</p>}

            {deleteBooking.error && <p className="bg-red-500 p-5">Oops! Something went wrong! {deleteBooking.error.message}</p>}

            {date.dateTime ? (
                <div className="flex flex-col justify-center items-center mt-5 min-h-[200px] w-full">
                    <p className="bg-gray-100 p-5 m-5 text-center">
                        You have chosen a {rooms && rooms?.find(roomToCheck => roomToCheck.id === room.roomId)?.interval || <span>Error_in_booking_comp</span>}-min booking at the time 
                        <br></br> 
                        {format(date.dateTime, `EEEE kk:mm, MMMM do, yyyy`)}
                    </p>
                    <BtnBook 
                        userSubscriptionPlan={userSubscriptionPlan}
                        date={date}
                        handleCreateBooking={handleCreateBooking}
                        createBookingIsLoading={createBooking.isLoading}
                        room={room}
                    />
                    {createBooking.error && <p className="bg-red-500 p-5">Oops! Something went wrong! {createBooking.error.message}</p>}
                </div>
            ) : (<div style={{height: "200px"}}></div>)}
        </section>
    );
};
