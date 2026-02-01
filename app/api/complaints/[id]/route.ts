import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    return NextResponse.json({
        message: `Get complaint ${params.id} - to be implemented`
    });
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    return NextResponse.json({
        message: `Update complaint ${params.id} status - to be implemented`
    });
}
