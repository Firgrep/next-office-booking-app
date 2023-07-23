import React from 'react';
import ReactCalendar from 'react-calendar';
import {add, format} from "date-fns";
import { useSession } from 'next-auth/react';
import { type Booking } from '@prisma/client';
import { REFUND_TIME_LIMIT } from '~/constants/client/site';


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

    const getTimes = (): Date[] | undefined => {
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

    const times = getTimes(); // becomes defined once `date.justDate` is defined.

    return (
        <>
            <div>
                <ReactCalendar 
                    minDate={new Date()}
                    className="REACT-CALENDAR p-2"
                    view="month"
                    value={date.justDate} // added to reset the date whenever the user switches between already-rendered calendars
                    tileContent={({ activeStartDate, date, view }) => {
                        // Calendar tile content display control.
                        if (view === "month") {
                            if (bookings) {
                                const hasBooking = bookings.some(booking => 
                                    booking.startTime.getFullYear() === date.getFullYear() &&
                                    booking.startTime.getMonth() === date.getMonth() &&
                                    booking.startTime.getDate() === date.getDate()    
                                );
                                
                                // If there is booking on the day, indicate this in the UI.
                                if (hasBooking) {
                                    return(
                                        <div className="flex justify-center">
                                            <div className="mt-2 bg-yellow-500 w-1/3">&nbsp;</div>
                                        </div>
                                    )
                                }
                            }
                        }

                        // Anything past yesterday has no indications to make in the tile content. 
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1); 
                        if (date < yesterday) {
                            return(
                                <div></div>
                            )
                        }

                        // TODO implement fully booked day indicator. Compare two arrays?

                        // Otherwise, the day is entirely free and indicate this in the UI.
                        return(
                            <div className="flex justify-center">
                                <div className="mt-2 bg-green-500 w-1/3">&nbsp;</div>
                            </div>
                        )
                    }}
                    onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date}))}
                />

                {/*
                    Times display kicks in once `date.justdate` has been selected and defined. It then 
                    loops through the times array, which is an array of Date objects. Each Date object has its
                    time checked against the time of a booking object, and if there is a match, a second check
                    is performed to match this booking to the currently logged in user. If second check matches
                    booking to the logged in user, the individual time display becomes interactive, if not, the
                    individual time display is a booking that belongs to another user and no interactivity is
                    made available. If the first check has no match, an interactive time display is rendered,
                    which sets the hourly time, which allows the next step to render.
                    If `date.justDate` remains undefined, a flavour text below is rendered.
                */}
                {(
                    date.justDate
                ) ? (
                    <div className='flex flex-wrap gap-5 min-h-[200px] mt-5'>
                        {times?.map((time, i) => (
                            <div 
                                key={`time-${i}`}
                            >
                                {/* Checking for a time match between Date and booking. */}
                                {(bookings?.some( booking => 
                                    booking.startTime.getFullYear() === time.getFullYear() &&
                                    booking.startTime.getMonth() === time.getMonth() &&
                                    booking.startTime.getDate() === time.getDate() &&
                                    booking.startTime.getHours() === time.getHours() &&
                                    booking.startTime.getMinutes() === time.getMinutes()) 
                                ) ? (
                                    // Second check to match booking to the logged in user.
                                    (bookings?.some( booking =>
                                        booking.userId === sessionData?.user.id)
                                    ) ? (
                                        // Booking matches logged user and interactivity is rendered  with this time display.
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

                                            <dialog id={`modal_confirm_delete_${i}`} className="bg-custom-gray backdrop:bg-slate-600/[.5]">
                                                <form method="dialog">
                                                    <h3 className="font-bold text-lg text-center">Cancel booking?</h3>
                                                    <p className="py-4">
                                                        Confirm cancellation of
                                                        <span className="font-medium"> {selectedRoom && selectedRoom.name} </span> 
                                                        booking on 
                                                        <span className="font-medium"> {format(time, `EEEE, MMMM do, yyyy, kk:mm`)}</span>
                                                        ?
                                                    </p>

                                                    {/* 
                                                        If booking contains a paymentIntentId, it means that it was individually purchased,
                                                        and that therefore it can be potentially refunded upon cancellation.
                                                    */}
                                                    {bookings?.some(booking =>
                                                        booking.userId === sessionData?.user.id &&
                                                        booking.paymentIntentId) 
                                                    &&
                                                    <div className="flex justify-center">
                                                    {(  
                                                        bookings?.some(booking =>
                                                        booking.userId === sessionData?.user.id &&
                                                        booking.startTime.getTime() === times[i]?.getTime() &&
                                                        booking.paymentIntentId &&
                                                        (booking.startTime.getTime() - new Date().getTime()) > REFUND_TIME_LIMIT)
                                                    ) ? (
                                                        <p className="bg-green-200 p-2 rounded-md mb-4">This cancellation will refund your purchase.</p>
                                                    ) : (
                                                        <p className="bg-red-200 p-2 rounded-md mb-4 max-w-md">This cancellation is within the {REFUND_TIME_LIMIT / 3_600_000}-hour window before the booking start time and can longer be refunded.</p>
                                                    )}
                                                    </div>}

                                                    <div className="flex justify-between">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary hover:bg-red-500"
                                                            onClick={() => handleDeleteBooking(time)}
                                                        >
                                                            Confirm Cancellation
                                                        </button>
                                                        <button 
                                                            className="btn btn-secondary"
                                                            type="button" 
                                                            onClick={() => handleCloseModal(i)}
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </form>
                                            </dialog>
                                        </>
                                    ) : (
                                        // Booking does not match logged in user, a static red time display is rendered.
                                        <button 
                                            className="flex rounded-sm bg-red-500 p-5"
                                            type="button"
                                            disabled
                                        >
                                            {format(time, 'kk:mm')}
                                        </button>
                                    )
                                ) : (
                                    // No booking is found that matches the time, therefore active button is rendered
                                    // to set the new hourly time for the next step.
                                    <button className={`flex rounded-sm p-5 ${(
                                        // This checks if the user has selected a time display, and if so, 
                                        // should render a different set of button colors.
                                        date.dateTime?.getFullYear() === time.getFullYear() &&
                                        date.dateTime?.getMonth() === time.getMonth() &&
                                        date.dateTime?.getDate() === time.getDate() &&
                                        date.dateTime?.getHours() === time.getHours() &&
                                        date.dateTime?.getMinutes() === time.getMinutes()
                                        ) ? (
                                            "bg-custom-yellow hover:bg-custom-brown"     
                                        ) : (       
                                            "bg-white hover:bg-custom-pink" 
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
                    // `date.justDate` remains undefined (or unselected), and therefore the follow is rendered
                    // until the user makes a date selection on the calendar.
                    <div className="h-[30rem]">
                        <p className="text-xl text-center p-4">📅 Then select the date!</p>
                    </div>
                )}
            </div>
        </>
    );
};
