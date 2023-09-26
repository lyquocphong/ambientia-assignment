import { Slot } from '@/libs/booking'
import React from 'react'
import { useTimezone } from '@/hooks/useTimezone';

type BookingSlotProps = {
    onSelected: (slot: Slot) => void
    slot: Slot
}

const BookingSlot: React.FunctionComponent<BookingSlotProps> = ({ onSelected, slot }) => {
    const { format } = useTimezone();
    const startTime = format(slot.startTime, 'HH:mm')
    const endTime = format(slot.endTime, 'HH:mm')

    return (
        <div
            className="
                bg-white p-[10px] border-gray-300 rounded-[12px]
                my-4
                w-5/12
            ">

            <div className="mt-2 text-center">
                <h1>{startTime} - {endTime}</h1>
            </div>

            <div className="mt-1 px-1 w-full flex gap-2">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => onSelected(slot)}
                >
                    Select
                </button>
            </div>
        </div>
    )
}

export default BookingSlot;
