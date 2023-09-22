'use client'

import React from 'react'
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment-timezone';
import { useAppContext } from '@/contexts/AppContext';

type BookingCalendarProps = {
    onDateSelected?: (date: moment.Moment) => any,
    selectedDate: moment.Moment,
    operationDateOfWeek?: number[],
}

const BookingCalendar: React.FunctionComponent<BookingCalendarProps> = ({ onDateSelected, operationDateOfWeek, selectedDate }) => {

    const { appInfo } = useAppContext();

    // Function to disable specific days of the week (e.g., Saturday and Sunday)
    const isDayDisabled = (date: Date) => {

        if (!operationDateOfWeek) {
            return false;
        }

        const dayOfWeek = date.getDay();
        
        return !operationDateOfWeek.includes(dayOfWeek);
    };
    
    const handleDateChange = (date: Date) => {
        const selectedMoment = moment.tz(date, appInfo.timezone);

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
            />
        </div>
    );
}

export default BookingCalendar;