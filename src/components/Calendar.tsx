import React from 'react';
import ReactCalendar from 'react-calendar';
import {add, format} from "date-fns";
import { CLOSING_TIME, INTERVAL, OPENING_TIME } from '~/constants/config';
//import { useSession } from 'next-auth/react';

type calendarProps = {
    bookings: undefined | any[],
    date: DateType,
    setDate: React.Dispatch<React.SetStateAction<DateType>>
}

export const Calendar: React.FC<calendarProps> = ({bookings, date, setDate}) => {
    //const { data: sessionData } = useSession();

    console.log("bookings from calendar comp: \n", bookings);

    const getTimes = () => {
        if(!date.justDate) return;

        const {justDate} = date;

        const beginning = add(justDate, { hours: OPENING_TIME });
        const end = add(justDate, { hours: CLOSING_TIME });
        const interval = INTERVAL;

        const times = []
        for (let i = beginning; i <= end; i = add(i, {minutes: interval})) {
            times.push(i);
        }
        
        return times;
    };

    const times = getTimes();
    const testDate = new Date(2023, 5, 27);
    // console.log("getting month ", testDate.getMonth());
    
    // !TODO Add display in the hours of the day of the booking. 

    return (
        <>
            <div>
                <ReactCalendar 
                    minDate={new Date()}
                    className="REACT-CALENDAR p-2"
                    view="month"
                    // showWeekNumbers={true}
                    // tileContent={({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 0 ? <p>It's Sunday!</p> : null}
                    // tileContent={<div><p>test</p><p>test</p></div>}
                    tileContent={({ activeStartDate, date, view }) => {
                        if (view === "month") {
                            const hasBooking = bookings?.some(booking => 
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

                        return(
                            <div className="flex justify-center">
                                <div className="mt-2 bg-green-500 w-1/3">&nbsp;</div>
                            </div>
                        )
                    }}
                    onClickDay={(date) => setDate((prev) => ({ ...prev, justDate: date}))}
                />

                {date.justDate ? (
                    <div className='flex flex-wrap min-h-[200px]'>
                        {times?.map((time, i) => (
                            <div 
                                key={`time-${i}`}
                                className="flex rounded-sm bg-gray-100 p-2 mr-3 mt-5 mb-5"
                            >
                                <button
                                    className="items-middle" 
                                    type="button"
                                    onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))}
                                >
                                    {format(time, 'kk:mm')}
                                </button>
                            </div>
                        ))}
                        {/* <button
                            className="rounded-sm bg-red-500 p-2"
                            type="button"
                            onClick={() => setDate((prev) => ({ ...prev, justDate: null }))}
                        >
                            Back
                        </button> */}
                    </div>
                ) : (<div style={{height: "200px"}}></div>)}
            </div>
        </>
    );
};
