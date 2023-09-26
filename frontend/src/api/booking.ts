import { BookingInfo } from "@/libs/booking";
import { makeRequest } from "@/libs/request";

type reserveBookingResponse = {
    slot: BookingInfo
}

export async function reserveBookingApi(url: string, { arg }: { arg: { email: string, startTime: string } }): Promise<reserveBookingResponse> {
    return await makeRequest<reserveBookingResponse>(url, 'POST', {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg)
    });
}