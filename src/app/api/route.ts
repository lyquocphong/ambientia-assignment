import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        service: {
            name: 'Main hieronta'
        }
    })
}