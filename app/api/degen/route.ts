import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	// get the query parameters
	const urlSearchParams = new URLSearchParams(request.nextUrl.search);

	// get the value of the `fid` query parameter
	const fid = urlSearchParams.get('fid');

	// if the `fid` query parameter is not provided
	if (!fid) {
		// return an error response
		return NextResponse.json({ message: 'Please provide a valid fid', error: true, success: false });
	}

	// return a success response
	const url = 'https://degentipme-3f9959094869.herokuapp.com/api/get_allowance?fid=' + fid;

	try {
		const response = await axios.get(url);
		return NextResponse.json({ ...response.data, error: false, success: true });
	} catch (error) {
		return NextResponse.json({ message: 'An error occurred', error: true, success: false });
	}
}
