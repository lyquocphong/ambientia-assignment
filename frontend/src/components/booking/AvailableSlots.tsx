'use client';
import { useAppContext } from '@/contexts/AppContext';
import { useAPI } from '@/hooks/useApi';
import { Slot } from '@/libs/booking';
import moment from 'moment-timezone';
import React, { useRef, useState, useEffect } from 'react';
import useSWRMutation from 'swr/mutation'
import { makeRequest } from "@/libs/request";
import Spinner from '@/components/shared/Spinner';

type BookingInfo = {
    identifier: string;
    email: string;
} & Slot;

type AvaiableSlotsProps = {
    from: moment.Moment;
    to: moment.Moment;
};

async function reserveBooking(url: string, { arg }: { arg: { email: string, startTime: string } }): Promise<BookingInfo> {
    return await makeRequest<BookingInfo>(url, 'POST', {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg)
    });
}

export const AvailableSlots: React.FunctionComponent<AvaiableSlotsProps> = ({ from, to }) => {

    const { appInfo } = useAppContext();

    const { trigger, isMutating, error: bookError, data: bookingInfo, reset } = useSWRMutation('/api/booking/reserve', reserveBooking)

    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);

    const encodedFrom = encodeURIComponent(from.toISOString());
    const encodedTo = encodeURIComponent(to.toISOString());
    const url = `api/booking/availability?from=${encodedFrom}&to=${encodedTo}`;

    const { data, isError, isLoading, revalidate } = useAPI<{ slots: Slot[]; }>(url);

    useEffect(() => {
        setSelectedSlot(null);
    }, [from, to])

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedSlot === null || emailRef.current === null) {
            return;
        }

        await trigger(
            {
                startTime: moment(selectedSlot.startTime).tz(appInfo.timezone).toISOString(),
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

    const onCancel = () => {
        setSelectedSlot(null);
        reset();
    }


    if (isLoading) {        
        return <Spinner/>;
    }

    if (isError || !data?.slots) {        
        return <h1>Error happen</h1>;
    }

    if (data.slots.length === 0) {
        return <h1>No slots available</h1>;
    }

    return (
        <main className="my-4 p-4 content w-full md:max-w-md bg-blue-100 flex flex-wrap gap-1 justify-evenly">
            {selectedSlot && (
                <div>
                    <div key={selectedSlot.startTime}
                        className="
                                  bg-white p-[10px] border-gray-300 rounded-[12px]
                                  my-4
                                 ">

                        <div className="mt-2 text-center">
                            <h1>{moment(selectedSlot.startTime).tz(appInfo.timezone).format('hh:mm')} - {moment(selectedSlot.endTime).tz(appInfo.timezone).format('hh:mm')}</h1>
                        </div>

                        {bookingInfo ? (
                            <>
                                <div className="mt-2 text-center">
                                    <h1>Status:</h1>
                                    <p>Your booking is reserved</p>
                                </div>
                                <div className="mt-2 text-center">
                                    <h1>Booking ID:</h1>
                                    <p>{bookingInfo.slot.identifier}</p>
                                </div>
                                <div className="mt-2 text-center">
                                    <h1>Email:</h1>
                                    <p>{bookingInfo.slot.email}</p>
                                </div>
                                <div className="mt-2 text-center">
                                <button
                                    className="bg-rose-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => onCancel()}
                                >
                                    Close
                                </button>
                                </div>
                            </>
                        ) : (
                            <><form
                                className="mt-1 px-1 w-full flex gap-2"
                                onSubmit={onFormSubmit}
                            >
                                <input type='email'
                                    ref={emailRef}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline p-2"
                                    required={true}
                                    placeholder='email'
                                />
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    {isMutating && <Spinner/>}
                                    Book
                                </button>

                                <button
                                    className="bg-rose-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => onCancel()}
                                >
                                    Cancel
                                </button>
                            </form>
                                {bookError && <h1 className="text-red-500 ml-2">{bookError.message}</h1>}
                            </>
                        )}


                    </div>
                </div>
            )
            }

            {
                selectedSlot == null && data.slots.map((slot: Slot) => {
                    return (
                        <div key={slot.startTime}
                            className="
                                  bg-white p-[10px] border-gray-300 rounded-[12px]
                                  my-4
                                  w-5/12
                                 ">

                            <div className="mt-2 text-center">
                                <h1>{moment(slot.startTime).tz(appInfo.timezone).format('hh:mm')} - {moment(slot.endTime).tz(appInfo.timezone).format('hh:mm')}</h1>
                            </div>

                            <div className="mt-1 px-1 w-full flex gap-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    Select
                                </button>
                            </div>
                        </div>
                    );
                })
            }
        </main >
    );
};

export default AvailableSlots