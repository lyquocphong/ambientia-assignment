'use client'

import React from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment-timezone';
import { useTimezone } from '@/hooks/useTimezone';

type BookingCalendarProps = {
    onDateSelected?: (date: moment.Moment) => any,
    selectedDate: moment.Moment,
    operationDateOfWeek?: number[],
}

const BookingCalendar: React.FunctionComponent<BookingCalendarProps> = ({ onDateSelected, operationDateOfWeek, selectedDate }) => {
    const { timezone, format } = useTimezone();

    // Function to disable specific days of the week (e.g., Saturday and Sunday)
    const isDayDisabled = (date: Date) => {

        if (!operationDateOfWeek) {
            return false;
        }

        const dayOfWeek = date.getDay();

        return !operationDateOfWeek.includes(dayOfWeek);
    };

    const handleDateChange = (date: Date) => {
        const selectedMoment = moment.tz(date, timezone);

        if (onDateSelected) {
            onDateSelected(selectedMoment);
        }
    };

    return (
        <div>
            <Calendar
                value={selectedDate.toDate()}
                onChange={(value) => handleDateChange(value as Date)}
                minDate={new Date()}
                tileDisabled={({ date }) => isDayDisabled(date)}
                tileClassName='bg-rose-500'
            />

            <h1 className='text-center'>Selected date: {format(selectedDate.toISOString(), 'YYYY-MM-DD')}</h1>
        </div>
    );
}

export default BookingCalendar;