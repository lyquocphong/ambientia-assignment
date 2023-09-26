import { makeRequest } from "@/libs/request";

export type Schedule = {
    dateOfWeek: number;
    enabled: boolean;
    from: string;
    to: string;
}

export type BookingInfo = {
    identifier: string;
    email: string;
    status: string;
} & Slot;


export type AppInfo = {
    service: {
        name: string,
        price: number,
        duration: number,
        schedule: [Schedule]
    },
    timezone: string
}

export type Slot = {
    startTime: string;
    endTime: string;
};

export type AvailabilityResponse = {
    slots: [Slot]
}

export const getAppInfo = async (): Promise<AppInfo> => {
    const url = `${process.env.BOOKING_API_HOST}/config`;
    return await makeRequest<AppInfo>(url, 'GET');
}

export const getAvailabilitySlots = async (from: string, to: string): Promise<AvailabilityResponse> => {
    const encodedFrom = encodeURIComponent(from);
    const encodedTo = encodeURIComponent(to);

    const url = `${process.env.BOOKING_API_HOST}/booking/availability?from=${encodedFrom}&to=${encodedTo}`;
    return await makeRequest<AvailabilityResponse>(url, 'GET', {
        next: { revalidate: 2 }
    });
}

export const reserveBooking = async (startTime: string, email: string): Promise<void> => {
    const url = `${process.env.BOOKING_API_HOST}/booking/reserve`;

    const payload = JSON.stringify({
        startTime,
        email
    })

    return await makeRequest(url, 'POST', {
        body: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}