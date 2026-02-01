import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    return NextResponse.json({
        message: 'File upload API - to be implemented',
        note: 'This will handle photo uploads to Supabase Storage'
    });
}
