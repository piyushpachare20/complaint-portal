import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'Wards API - to be implemented',
        note: 'This will return list of all wards (public data)'
    });
}
