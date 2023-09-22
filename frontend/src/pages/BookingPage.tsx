'use client'

import AvailableSlots from '@/components/booking/AvailableSlots';
import BookingCalendar from '@/components/booking/BookingCalendar';
import { AppProvider } from '@/contexts/AppContext';
import { AppInfo } from '@/libs/booking';
import moment from 'moment-timezone';
import React, { useState } from 'react';

type BookingPageProps = {
    appInfo: AppInfo;
};

const BookingPage: React.FunctionComponent<BookingPageProps> = ({ appInfo }) => {

    const { timezone } = appInfo;

    const currentDate = moment.tz(timezone);    

    const [selectedDate, setSelectedDate] = useState(currentDate);    

    const from = selectedDate.clone().startOf('day');
    const to = selectedDate.clone().endOf('day');

    const operationWeekDays: number[] = [];

    appInfo.service.schedule.forEach((schedule) => {
        if (schedule.enabled) {
            operationWeekDays.push(schedule.dateOfWeek);
        }
    })

    const onDateSelected = (date: moment.Moment) => {
        setSelectedDate(date);
    }

    return (
        <main className="relative content w-full md:max-w-md min-h-screen bg-blue-100">
            <section className='flex flex-col justify-center items-center'>
                <AppProvider appInfo={appInfo}>
                    <BookingCalendar onDateSelected={onDateSelected} selectedDate={selectedDate} operationDateOfWeek={operationWeekDays} />
                    <h1>Selected date: {selectedDate.format('YYYY-MM-DD')}</h1>

                    <AvailableSlots from={from} to={to} />
                </AppProvider>
            </section>
        </main>
    )
}

export default BookingPage;