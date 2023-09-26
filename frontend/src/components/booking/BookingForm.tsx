'use client'

import { Slot } from '@/libs/booking'
import React, { useRef } from 'react'
import { useTimezone } from '@/hooks/useTimezone';

type BookingFormProps = {
    onSubmit: (emailRef: React.MutableRefObject<HTMLInputElement | null>, slot: Slot) => void
    actions: (emailRef: React.MutableRefObject<HTMLInputElement | null>, slot: Slot) => JSX.Element,
    slot: Slot,
    error: string | null
}

const BookingForm: React.FunctionComponent<BookingFormProps> = ({ actions, error, slot, onSubmit }) => {

    const emailRef = useRef<HTMLInputElement | null>(null);    
    const {format} = useTimezone();
    const startTime = format(slot.startTime, 'HH:mm');
    const endTime = format(slot.endTime, 'HH:mm');

    return (
        <>
            <div className="mt-2 text-center">
                <h1>{startTime} - {endTime}</h1>
            </div>

            <form
                className="mt-1 px-1 w-full flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(emailRef, slot);
                }}
            >
                <input type='email'
                    ref={emailRef}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2"
                    required={true}
                    placeholder='email'
                />

                {actions(emailRef, slot)}

                {error && <h1 className="text-red-500 m-2">{error}</h1>}
            </form>
        </>
    )
}

export default BookingForm;
