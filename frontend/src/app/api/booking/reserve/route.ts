import {  reserveBooking } from '@/libs/booking';
import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {

    const {email, startTime} = await request.json();

    if (!email || !startTime) {
        return NextResponse.json({ error: 'email or startTime is missing' }, { status: 500 });
    }

    const slot = await reserveBooking(startTime, email);
    
    return NextResponse.json({ slot })
}