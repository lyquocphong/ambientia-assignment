import { makeRequest } from "@/libs/request";

type Schedule = {
    dateOfWeek: number;
    enabled: boolean;
    from: string;
    to: string;
}

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
    console.log(url);
    return await makeRequest<AvailabilityResponse>(url, 'GET');
}