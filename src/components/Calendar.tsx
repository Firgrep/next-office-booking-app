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

    return (
        <>
            <div>
                <ReactCalendar 
                    minDate={new Date()}
                    className="REACT-CALENDAR p-2"
                    view="month"
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
                            >
                                {(bookings?.some( booking => 
                                    booking.startTime.getFullYear() === time.getFullYear() &&
                                    booking.startTime.getMonth() === time.getMonth() &&
                                    booking.startTime.getDate() === time.getDate() &&
                                    booking.startTime.getHours() === time.getHours()) 
                                ) ? (
                                    <button 
                                        className="flex rounded-sm bg-red-500 p-2 mr-3 mt-5 mb-5"
                                        type="button"
                                        disabled
                                    >
                                        {format(time, 'kk:mm')}
                                    </button>
                                ) : (

                                    // !TODO
                                    // !TODO work out how to add book button via daisy indicator

                                    <button className={`flex rounded-sm p-5 mr-3 mt-5 mb-5 ${(
                                        date.dateTime?.getFullYear() === time.getFullYear() &&
                                        date.dateTime?.getMonth() === time.getMonth() &&
                                        date.dateTime?.getDate() === time.getDate() &&
                                        date.dateTime?.getHours() === time.getHours()
                                        ) ? (
                                            "bg-yellow-500"     
                                        ) : (       
                                            "bg-gray-100" 
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
                ) : (<div style={{height: "200px"}}></div>)}

                <div className="indicator">
                    <div className="indicator-item indicator-bottom">
                        <button className="btn btn-primary">Apply</button>
                    </div> 
                    <button className="bg-gray-100 p-10 btn"><span className="text-slate-600">Testing button test</span></button>
                </div>
                
            </div>
        </>
    );
};
