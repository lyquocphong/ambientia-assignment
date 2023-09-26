import { getAvailabilitySlots } from '@/libs/booking';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (!from || !to) {
        return NextResponse.json({ error: 'from or to is missing' }, { status: 500 });
    }

    const availableSlots = await getAvailabilitySlots(from, to);

    return NextResponse.json(availableSlots)
}