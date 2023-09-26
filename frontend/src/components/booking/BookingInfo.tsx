import { BookingInfo } from '@/libs/booking'
import React from 'react';
import { useTimezone } from '@/hooks/useTimezone';


type BookingInfoProps = {
    bookingInfo: BookingInfo
}

const BookingInfo: React.FunctionComponent<BookingInfoProps> = ({ bookingInfo }) => {

    const {format} = useTimezone();
    const startTime = format(bookingInfo.startTime);

    return (
        <>
            <div className="mt-2 text-center">
                <h1>Status:</h1>
                <p>Your booking is {bookingInfo.status}</p>
            </div>
            <div className="mt-2 text-center">
                <h1>Time:</h1>
                <p>{startTime}</p>
            </div>
            <div className="mt-2 text-center">
                <h1>Booking ID:</h1>
                <p>{bookingInfo.identifier}</p>
            </div>
            <div className="mt-2 text-center">
                <h1>Booking ID:</h1>
                <p>{bookingInfo.identifier}</p>
            </div>
            <div className="mt-2 text-center">
                <h1>Email:</h1>
                <p>{bookingInfo.email}</p>
            </div>
        </>
    )
}

export default BookingInfo;