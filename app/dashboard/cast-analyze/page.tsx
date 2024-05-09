'use client';

import VideoPlayer from '@/components/VideoPlayer';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
	const [cast, setCast] = useState<any>([]);
	const [castUrl, setCastUrl] = useState('');

	useEffect(() => {
		if (castUrl) {
			console.log(castUrl);
		}
	}, [castUrl]);

	const fetchCast = async () => {
		const url = `/api/analyze?castUrl=${encodeURIComponent(castUrl)}`;
		const response = await axios.get(url);
		console.log(response.data);
		if (response.data.error) {
			console.error(response.data.message);
			return;
		}

		setCast(response.data.cast);
	};

	useEffect(() => {
		if (cast) {
			console.log('From the state:', cast);
		}
	}, [cast]);

	// about caster
	const username = cast?.author?.username;

	// about cast
	const text = cast?.text; // this should be rendered so that \n can be rendered as line
	const timestamp = cast?.timestamp;
	const embeds = cast?.embeds;
	const hash = cast?.hash;

	// stats
	const likes_count = cast?.reactions?.likes_count;
	const recasts_count = cast?.reactions?.recasts_count;
	const replies = cast?.replies?.count;

	// list recasts
	const recasts = cast?.list_recasts?.reactions;

	const copyAllAddresses = () => {
		const addresses = recasts.map((recast: any) => recast.user?.verifications?.[0]);
		navigator.clipboard.writeText(addresses.join(', '));
		console.log('Copied all addresses');
		console.log(addresses);
	};

	return (
		<div className="max-w-[1440px] m-auto">
			<h1>Cast Analyse</h1>
			<input className="bg-gray-50" type="text" value={castUrl} onChange={(e) => setCastUrl(e.target.value)} />
			<br />
			<button onClick={() => fetchCast()} className="px-2 bg-blue-200">
				analyze
			</button>
			<br />
			<hr />
			<br />
			<div>@{username}'s post</div>
			<div>
				<p> {new Date(timestamp).toLocaleString()} </p>
			</div>
			<div>
				<pre>Hash: {hash}</pre>
				<p> {text} </p>
				<div className="w-[200px] h-auto">
					{embeds?.map((embed: any) => {
						if (embed?.url?.endsWith('.m3u8')) {
							return (
								<div key={embed.id}>
									<VideoPlayer src={embed?.url} />
								</div>
							);
						} else if (embed?.url?.match(/\.(jpeg|jpg|gif|png)$/) || embed?.url?.includes('imagedelivery.net')) {
							return (
								<div key={embed.id}>
									<img src={embed?.url} alt="Embed" />
								</div>
							);
						} else {
							return null;
						}
					})}
				</div>
			</div>
			<div>
				<p> Total Likes: {likes_count} </p>
				<p> Total Recasts: {recasts_count} </p>
				<p> Total Replies: {replies} </p>
			</div>
			<hr />
			<button onClick={() => copyAllAddresses()} className="bg-blue-200 p-3">
				Copy All Addresses
			</button>
			<p> Recasts: </p>
			<div className="space-y-4 mt-12 flex flex-col">
				{recasts?.map((recast: any, i: number) => {
					return (
						<div className="p-4 border w-auto" key={i}>
							<p>{i + 1}</p>
							<p> {recast.user?.display_name} </p>
							<p className="text-sm text-black/50"> @{recast.user?.username} </p>
							<p className="mt-2"> {recast.user?.verifications?.[0]} </p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
