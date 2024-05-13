'use client';

import SearchBar from '@/components/CastAnalyze/SearchBar';
import VideoPlayer from '@/components/VideoPlayer';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { useEffect, useState } from 'react';

/** Sample Data */
import { SampleCastWithVideo, SampleWarpcastURL } from './sample-state';
import LikeSVG from '@/components/CastAnalyze/LikeSVG';
import RecastSVG from '@/components/CastAnalyze/RecastSVG';
import ReplySVG from '@/components/CastAnalyze/ReplySVG';
import ClockSVG from '@/components/CastAnalyze/ClockSVG';

dayjs.extend(relativeTime);

export default function Page() {
	const [cast, setCast] = useState<any>(SampleCastWithVideo);
	const [castUrl, setCastUrl] = useState(SampleWarpcastURL);

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
	const pfp = cast?.author?.pfp_url;
	const display_name = cast?.author?.display_name;

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
		<div className="bg-primary-white min-h-screen">
			<div className="max-w-3xl m-auto">
				<div className="pt-4">
					<SearchBar castUrl={castUrl} setCastUrl={setCastUrl} fetchCast={fetchCast} />
				</div>
				<div className="w-full flex items-start space-x-4">
					<div className="mt-4 w-1/4">
						<div className="shadow-sm bg-white font-space-mono rounded-md uppercase font-medium">
							<div className="font-medium flex items-center rounded-t-md border-b text-[10px] text-black/40 w-full py-2 px-2 justify-between">
								<ClockSVG className="w-5 h-5 opacity-80 text-slate-300" />
								<span>{dayjs(timestamp).fromNow()}</span>
							</div>
							<div className="font-medium inline-flex border-b text-xs w-full py-2 px-2 justify-between">
								<LikeSVG className="w-5 h-5 opacity-80 text-green-500" />
								<span>{likes_count} Likes</span>
							</div>
							<div className="font-medium inline-flex border-b text-xs w-full py-2 px-2 justify-between">
								<ReplySVG className="w-5 h-5 text-green-500" />
								<span>{replies} replies</span>
							</div>
							<div className="font-medium inline-flex border-b text-xs w-full py-2 px-2 justify-between">
								<RecastSVG className="w-5 h-5 text-green-500" />
								<span>{recasts_count} Recasts</span>
							</div>

							{/* <div className="font-medium inline-flex text-[#5F5E5B] border-b text-xs w-full py-2 px-2 justify-between">
								🎩
								<span>{replies} $DEGEN</span>
							</div> */}
						</div>
					</div>
					<div className="bg-white mt-4 rounded-md shadow-sm w-3/4">
						<div className="flex space-x-4 items-start">
							<div className="flex items-start justify-center space-x-4 p-6">
								<div className="w-full">
									<div className="flex items-center space-x-4">
										<div>
											<img className="w-12 rounded-full" src={pfp} alt="Profile" />
										</div>
										<div className="flex flex-col items-start justify-start">
											<div className="font-medium opacity-80 text-base font-sans">{display_name}</div>
											<div className="font-medium opacity-35 text-xs">@{username}</div>
										</div>
									</div>

									<div className="font-sans text-sm mt-6" dangerouslySetInnerHTML={{ __html: text?.replace(/\n/g, '<br />') }} />
									<div className="w-full m-auto border-10 h-auto mt-4">
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
														<img className="rounded-md" src={embed?.url} alt="Embed" />
													</div>
												);
											} else {
												return (
													<div key={embed.id}>
														<iframe src={embed?.url} className="w-full h-96" />
													</div>
												);
											}
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

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
