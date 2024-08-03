// File: app/go/[fid]/route.ts

import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { fid: string } }) {
	const fid = params.fid;

	if (!fid) {
		console.log('FID is missing');
		return NextResponse.json({ error: 'fid parameter is required' }, { status: 400 });
	}

	// if fid is not numeric, return an error
	if (isNaN(parseInt(fid))) {
		console.log('FID is not numeric');
		return NextResponse.json({ error: 'fid parameter must be numeric' }, { status: 400 });
	}

	const url = 'https://api.neynar.com/v2/farcaster/user/bulk?fids=' + fid;
	const headers = {
		accept: 'application/json',
		api_key: 'NEYNAR_API_DOCS',
	};

	let result;

	try {
		result = await axios.get(url, { headers });

		if (!result) {
			console.log('Error fetching data');
			return NextResponse.redirect('https://warpcast.com');
		}

		console.log('Data fetched successfully');
		console.log('Result:', result.data);
		// if there is data, get the first item
		const user = result?.data?.users[0] || {};

		console.log('User:', user);

		//redirect to data.username after warpcast.com/username

		return NextResponse.redirect('https://warpcast.com/' + user.username);
	} catch (error) {
		console.log('Error fetching data:', error);
		return NextResponse.redirect('https://warpcast.com');
	}
}
