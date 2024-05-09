import { NextRequest, NextResponse } from 'next/server';
import { FeedType, FilterType, NeynarAPIClient } from '@neynar/nodejs-sdk';

// const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '62289850-45F5-4634-90FA-D28A77D1D42D');

export async function GET() {
	return NextResponse.json({ message: 'Hello World' });
}
