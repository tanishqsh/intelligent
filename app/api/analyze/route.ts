import { NextRequest, NextResponse } from 'next/server';
import { CastParamType, NeynarAPIClient, ReactionsType } from '@neynar/nodejs-sdk';

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS');

export async function GET(request: NextRequest) {
	const urlSearchParams = new URLSearchParams(request.nextUrl.search);
	const castUrl = urlSearchParams.get('castUrl');

	if (!castUrl) {
		return NextResponse.json({ message: 'Please provide a valid URL', error: true, success: false });
	}

	let data: any;

	try {
		data = await client.lookUpCastByHashOrWarpcastUrl(castUrl, CastParamType.Url);
	} catch (error) {
		console.error('Error fetching cast (/analyze): ', error);
		return NextResponse.json({ message: 'Failed to fetch cast', error: true, success: false });
	}

	if (!data) {
		return NextResponse.json({ message: 'Cast not found', error: true, success: false });
	}

	// retrieving hash to call fetchReactionsForCast
	const cast = data.cast;
	let recasts: any;

	try {
		recasts = await client.fetchReactionsForCast(cast?.hash, ReactionsType.Recasts, {
			limit: 100,
		});
	} catch (error) {
		console.error('Error fetching reactions (/analyze): ', error);
		return NextResponse.json({ message: 'Failed to fetch reactions', error: true, success: false });
	}

	return NextResponse.json({ cast: { ...data.cast, list_recasts: recasts }, error: false, success: true });
}
