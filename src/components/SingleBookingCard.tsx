"use client"

import { type Booking } from "@prisma/client"
import { format } from "date-fns";
import { checkWhatRoom } from "~/utils/utils";


type SingleBookingCardProps = {
    booking: Booking;
    handleDeleteBooking: (bookingId: string, bookingUserId: string) => void,
}

/**
 * Component that displays individual booking information and allows cancellation, controlled by UserBookings.
 * @params booking object
 */
export const SingleBookingCard: React.FC<SingleBookingCardProps> = ({booking, handleDeleteBooking}) => {
    const meetingDuration = (booking.endTime.getTime() - booking.startTime.getTime()) / 60_000; // Divide milliseconds by 60000 to get minutes.
    const roomName = checkWhatRoom(booking.roomId);

    const handleOpenModal = (id: string) => {
        const modalElement = document.getElementById(`modal_confirm_delete_${id}`) as HTMLDialogElement;
        
        const handleModalClick = (e: MouseEvent, modalElement: HTMLDialogElement) => {
            const dialogDimensions = modalElement.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                modalElement.close();
                modalElement.removeEventListener("click", e => handleModalClick(e, modalElement));
            }
        };
        
        if (modalElement) {
            modalElement.showModal();
            modalElement.addEventListener("click", e => handleModalClick(e, modalElement));
        }
    };

    const handleCloseModal = (id: string) => {
        const modalElement = document.getElementById(`modal_confirm_delete_${id}`) as HTMLDialogElement;
        if (modalElement) {
            modalElement.close();
        }
    };

    return(
        <div>
            <div className="flex bg-gradient-to-r from-purple-500 to-pink-500 rounded-md p-4 gap-6">
                <p>You have a {meetingDuration}-minute booking in {roomName} at {format(booking.startTime, `EEEE, MMMM do, yyyy, kk:mm`)}</p>
                <button 
                    type="button" 
                    onClick={() => handleOpenModal(booking.id)}
                    className="btn btn-sm btn-neutral bg-red-500 text-black hover:bg-violet-600"
                >Cancel</button>
            </div>
            <dialog id={`modal_confirm_delete_${booking.id}`} className="backdrop:bg-slate-600/[.5]">
                <form method="dialog">
                    <h3 className="font-bold text-lg text-center">Cancel booking?</h3>
                    <p className="py-4">
                        Confirm cancellation of
                        <span className="font-medium"> {roomName} </span> 
                        booking on 
                        <span className="font-medium"> {format(booking.startTime, `EEEE, MMMM do, yyyy, kk:mm`)}</span>
                        ?
                    </p>
                    <button
                        type="button"
                        className="btn bg-sky-500"
                        onClick={() => handleDeleteBooking(booking.id, booking.userId)}
                    >
                        Confirm Cancellation
                    </button>
                    <button type="button" onClick={() => handleCloseModal(booking.id)}>Close</button>
                </form>
            </dialog>
        </div>
    );
}
