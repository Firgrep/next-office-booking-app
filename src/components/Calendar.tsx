import React from 'react';
import ReactCalendar from 'react-calendar';
import {add, format} from "date-fns";
import { useSession } from 'next-auth/react';
import { type Booking } from '@prisma/client';


type calendarProps = {
    selectedRoom: undefined | SelectedRoomType,
    bookings: undefined | Booking[],
    date: DateType,
    setDate: React.Dispatch<React.SetStateAction<DateType>>,
    handleDeleteBooking: (bookingStartTime: Date) => void,
}

/**
 * Calendar component is meant to be used with Booking component. Generates to view a calendar and daily hours
 * based on the selected room input. Returns to parent the selected date.
 */
export const Calendar: React.FC<calendarProps> = ({bookings, date, setDate, selectedRoom, handleDeleteBooking}) => {
    const { data: sessionData } = useSession();

    const handleOpenModal = (id: number) => {
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

    const handleCloseModal = (id: number) => {
        const modalElement = document.getElementById(`modal_confirm_delete_${id}`) as HTMLDialogElement;
        if (modalElement) {
            modalElement.close();
        }
    };

    const getTimes = () => {
        if(!date.justDate) return;

        const {justDate} = date;

        const beginning = add(justDate, { hours: selectedRoom?.openingTime });
        const end = add(justDate, { hours: selectedRoom?.closingTime });
        const interval = selectedRoom?.interval;

        const times = [];
        for (let i = beginning; i <= end; i = add(i, {minutes: interval})) {
            times.push(i);
        }
        
        return times;
    };

    const times = getTimes();
    
    return (
        <>
            <div>
                <ReactCalendar 
                    minDate={new Date()}
                    className="REACT-CALENDAR p-2"
                    view="month"
                    tileContent={({ activeStartDate, date, view }) => {
                        if (view === "month") {
                            if (bookings) {
                                const hasBooking = bookings.some(booking => 
                                    booking.startTime.getFullYear() === date.getFullYear() &&
                                    booking.startTime.getMonth() === date.getMonth() &&
                                    booking.startTime.getDate() === date.getDate()    
                                );
    
                                if (hasBooking) {
                                    return(
                                        <div className="flex justify-center">
                                            <div className="mt-2 bg-yellow-500 w-1/3">&nbsp;</div>
                                        </div>
                                    )
                                }
                            }
                        }

                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1); 
                        if (date < yesterday) {
                            return(
                                <div></div>
                            )
                        }

                        return(
                            <div className="flex justify-center">
                                <div className="mt-2 bg-green-500 w-1/3">&nbsp;</div>
                            </div>
                        )
                    }}
                    onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date}))}
                />

                {(
                    date.justDate
                ) ? (
                    <div className='flex flex-wrap gap-5 min-h-[200px] mt-5'>
                        {times?.map((time, i) => (
                            <div 
                                key={`time-${i}`}
                            >
                                {(bookings?.some( booking => 
                                    booking.startTime.getFullYear() === time.getFullYear() &&
                                    booking.startTime.getMonth() === time.getMonth() &&
                                    booking.startTime.getDate() === time.getDate() &&
                                    booking.startTime.getHours() === time.getHours()) 
                                ) ? (
                                    (bookings?.some( booking =>
                                        booking.userId === sessionData?.user.id)
                                    ) ? (
                                        <>
                                            <div className="indicator">
                                                <div className="indicator-item indicator-top">
                                                    <button 
                                                        className="btn btn-circle btn-sm bg-red-500 border-solid border-2 border-red-600"
                                                        type="button"
                                                        onClick={() => handleOpenModal(i)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                                <button 
                                                    className="flex rounded-sm bg-green-500 hover:bg-red-700 p-5" 
                                                    type="button"
                                                    onClick={() => handleOpenModal(i)}
                                                    data-title="Click to cancel booking"
                                                >   
                                                    {format(time, 'kk:mm')}
                                                </button>
                                            </div>

                                            <dialog id={`modal_confirm_delete_${i}`} className="backdrop:bg-slate-600/[.5]">
                                                <form method="dialog">
                                                    <h3 className="font-bold text-lg text-center">Cancel booking?</h3>
                                                    <p className="py-4">Confirm cancellation of
                                                        <span className="font-medium"> {selectedRoom && selectedRoom.name} </span> 
                                                        booking on 
                                                        <span className="font-medium"> {format(time, `EEEE, MMMM do, yyyy, kk:mm`)}</span>?</p>
                                                    <button
                                                        type="button"
                                                        className="btn bg-sky-500"
                                                        onClick={() => handleDeleteBooking(time)}
                                                    >
                                                        Confirm Cancellation
                                                    </button>
                                                    <button type="button" onClick={() => handleCloseModal(i)}>Close</button>
                                                </form>
                                            </dialog>
                                        </>
                                    ) : (
                                        <button 
                                            className="flex rounded-sm bg-red-500 p-5"
                                            type="button"
                                            disabled
                                        >
                                            {format(time, 'kk:mm')}
                                        </button>
                                    )
                                ) : (
                                    <button className={`flex rounded-sm p-5 ${(
                                        date.dateTime?.getFullYear() === time.getFullYear() &&
                                        date.dateTime?.getMonth() === time.getMonth() &&
                                        date.dateTime?.getDate() === time.getDate() &&
                                        date.dateTime?.getHours() === time.getHours()
                                        ) ? (
                                            "bg-yellow-500 hover:bg-yellow-800"     
                                        ) : (       
                                            "bg-gray-100 hover:bg-violet-600" 
                                        )}`}
                                        type="button"
                                        onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))}
                                    >
                                        {format(time, 'kk:mm')}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-200">
                        <p className="text-xl">📅 Then select the date!</p>
                    </div>
                )}
            </div>
        </>
    );
};
