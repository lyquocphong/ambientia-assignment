'use client';
import { useAppContext } from '@/contexts/AppContext';
import { useAPI } from '@/hooks/useApi';
import { Slot } from '@/libs/booking';
import moment from 'moment-timezone';
import React, { useRef, useState, useEffect } from 'react';
import useSWRMutation from 'swr/mutation'
import Spinner from '@/components/shared/Spinner';
import BookingSlot from '@/components/booking/BookingSlot';
import BookingInfo from '@/components/booking/BookingInfo';
import { reserveBookingApi } from '@/api/booking';
import BookingForm from '@/components/booking/BookingForm';

type AvaiableSlotsProps = {
    from: moment.Moment;
    to: moment.Moment;
};

const AvailableSlots: React.FunctionComponent<AvaiableSlotsProps> = ({ from, to }) => {

    const { appInfo } = useAppContext();

    const { trigger, isMutating, error: bookError, data: bookingInfo, reset } = useSWRMutation('/api/booking/reserve', reserveBookingApi)

    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    const encodedFrom = encodeURIComponent(from.toISOString());
    const encodedTo = encodeURIComponent(to.toISOString());

    const url = `api/booking/availability?from=${encodedFrom}&to=${encodedTo}`;
    const { data, isError, isLoading, revalidate } = useAPI<{ slots: Slot[]; }>(url);

    useEffect(() => {
        setSelectedSlot(null);
    }, [from, to])

    const bookSlot = async (emailRef: React.MutableRefObject<HTMLInputElement | null>, slot: Slot) => {
        if (slot === null || emailRef.current === null) {
            return;
        }

        await trigger(
            {
                startTime: moment(slot.startTime).tz(appInfo.timezone).toISOString(),
                email: emailRef.current.value
            },
            {
                throwOnError: false,
                onSuccess: () => {
                    revalidate();
                }
            }
        )
    }

    const onCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSelectedSlot(null);
        reset();
    }


    if (isLoading) {
        return <Spinner />;
    }

    if (isError || !data?.slots) {
        return <h1>Error happen</h1>;
    }

    if (data.slots.length === 0) {
        return <h1>No slots available</h1>;
    }

    const cancelButton = <button
        className="bg-rose-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={onCancel}
    >
        Close
    </button>

    return (
        <main className="my-4 p-4 content w-full md:max-w-md bg-blue-100 flex flex-wrap gap-1 justify-evenly">
            {selectedSlot !== null ? (
                <div>
                    <div
                        className="bg-white p-[10px] border-gray-300 rounded-[12px] my-4">
                        {bookingInfo ? (
                            <>
                                <BookingInfo bookingInfo={bookingInfo.slot} />
                                <div className="mt-2 text-center">
                                    {cancelButton}
                                </div>
                            </>
                        ) : (
                            <BookingForm
                                onSubmit={bookSlot}
                                slot={selectedSlot}
                                error={bookError}
                                actions={
                                    (emailRef, slot) =>
                                        <>
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type='submit'
                                            >
                                                {isMutating && <Spinner />}
                                                Book
                                            </button>

                                            {cancelButton}
                                        </>
                                }
                            />
                        )}
                    </div>
                </div>
            ) : (
                data.slots.map((slot: Slot, index) => {
                    return (
                        <BookingSlot
                            key={index}
                            slot={slot}
                            onSelected={() => setSelectedSlot(slot)}
                        />
                    );
                }))
            }
        </main >
    );
};

export default AvailableSlots