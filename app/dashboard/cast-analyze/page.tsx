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
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);

export default function Page() {
	const [cast, setCast] = useState<any>(SampleCastWithVideo);
	const [castUrl, setCastUrl] = useState(SampleWarpcastURL);
	const [isLoaded, setIsLoaded] = useState(false);

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

		if (response.data.success) {
			setCast(response.data.cast);
			setIsLoaded(true);
		} else {
			toast.error('Failed to fetch cast, please try again later');
		}
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
		toast.success('Copied all addresses', {
			style: {
				background: '#fefefe',
				color: '#111',
				border: '1px solid #ededed',
				borderRadius: '5px',
				fontSize: '0.8rem',
				fontFamily: 'Satoshi, sans-serif',
			},
			iconTheme: {
				primary: '#F5F4FD',
				secondary: 'rgb(34 197 94);',
			},
		});
	};

	const castStats = [
		{
			icon: <ClockSVG className="w-5 h-5 text-slate-400" />,
			label: 'Age',
			value: dayjs(timestamp).fromNow(),
			valueClassName: 'text-sm normal-case text-black/20',
		},
		{
			icon: <LikeSVG className="w-5 h-5 text-slate-500" />,
			label: 'Likes',
			value: likes_count,
			valueClassName: 'px-2 py-[2px] text-sm rounded text-slate-500',
		},
		{
			icon: <ReplySVG className="w-5 h-5 text-slate-500" />,
			label: 'Replies',
			value: replies,
			valueClassName: 'px-2 py-[2px] text-sm rounded text-slate-500',
		},
		{
			icon: <RecastSVG className="w-5 h-5 text-slate-500" />,
			label: 'Recasts',
			value: recasts_count,
			valueClassName: 'px-2 py-[2px] text-sm rounded text-slate-500',
		},
	];

	const calculatedStats = [
		{
			icon: <LikeSVG className="w-5 h-5 text-slate-500" />,
			label: 'Likes / Min',
			value: Math.round((likes_count / ((Date.now() - new Date(timestamp).getTime()) / 60000)) * 1000) / 1000,
			valueClassName: 'px-2 py-[2px] text-sm rounded text-slate-500',
		},
	];

	return (
		<div className="bg-primary-white min-h-screen pb-[100px]">
			<div className="max-w-5xl m-auto">
				<div className="pt-4">
					<SearchBar isLoaded={isLoaded} castUrl={castUrl} setCastUrl={setCastUrl} fetchCast={fetchCast} />
				</div>
				<div className="w-full flex items-start space-x-4">
					<div className="mt-4 w-2/5">
						<motion.div
							initial={{ opacity: 1, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', stiffness: 100 }}
							className="shadow-sm bg-white font-inter rounded-md uppercase font-medium divide-y divide-dotted"
						>
							{castStats.map((stat, index) => (
								<motion.div
									initial={{ opacity: 0, y: 20, paddingTop: 10, paddingBottom: 10 }}
									animate={{ opacity: 1, y: 0, paddingTop: 10, paddingBottom: 10 }}
									whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
									transition={{ type: 'spring', stiffness: 100 }}
									key={index}
									className={`font-medium inline-flex text-xs w-full py-2 px-2 justify-between ${
										index === 0 ? 'flex items-center rounded-t-md' : 'font-medium'
									}`}
								>
									<div className="flex items-center space-x-2">
										{stat.icon}
										<span className="font-semibold text-slate-400 text-xs">{stat.label}</span>
									</div>
									<span className={stat.valueClassName}>{stat.value}</span>
								</motion.div>
							))}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', stiffness: 100 }}
							className="bg-white mt-4 rounded-md shadow-sm w-full"
						>
							<div className="text-xs py-3 px-3 border-b capitalize flex items-center justify-between font-medium">
								<span className="font-medium text-slate-400 text-sm">{recasts?.length} Recaster</span>
								<motion.button
									onClick={copyAllAddresses}
									initial={{ scale: 1, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									whileHover={{ scale: 0.98, opacity: 1 }}
									whileTap={{ scale: 0.9 }}
									className="flex space-x-2 items-center uppercase font-inter bg-[#FACC14]/25 px-2 py-1 rounded-md text-[#fab514]"
								>
									<svg className="w-5" fill="none" viewBox="0 0 24 24">
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M6.5 15.25V15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H13.5C14.4665 4.75 15.25 5.5335 15.25 6.5V6.5"
										></path>
										<rect
											width="10.5"
											height="10.5"
											x="8.75"
											y="8.75"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											rx="2"
										></rect>
									</svg>
									<span>Copy All</span>
								</motion.button>
							</div>
							<div className="space-y-1 mt-2 flex flex-col max-h-[400px] overflow-scroll px-2">
								{recasts?.map((recast: any, i: number) => {
									return (
										<motion.div
											key={i}
											initial={{ opacity: 0, paddingTop: 8, paddingBottom: 8, y: 30 }}
											animate={{ opacity: 1, paddingTop: 10, paddingBottom: 10, y: 0 }}
											whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
											transition={{ type: 'spring', stiffness: 100 }}
											className="flex items-center space-x-3 hover:bg-black/[0.03] rounded-md cursor-pointer "
										>
											<div className="flex-shrink-0 pl-2">
												<img className="w-10 border-4 border-[#ededed] h-10 rounded-full" src={recast?.user?.pfp_url} alt="Profile" />
											</div>
											<div className="flex flex-col items-start justify-start w-full">
												<div className="font-medium opacity-80 text-base font-sans">{recast?.user?.display_name}</div>
												<div className="font-medium opacity-35 text-xs">@{recast.user?.username}</div>
											</div>
											<div className="w-full flex justify-end pr-2">
												<motion.button initial={{ scale: 1 }} whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
													<div className="mt-2 mono font-mono text-xs px-2 py-0 rounded-md bg-gray-500/10 text-center inline-flex space-x-2">
														<svg className="w-5 h-8 text-gray-500" fill="none" viewBox="0 0 24 24">
															<path
																stroke="currentColor"
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="1.5"
																d="M19.25 8.25V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75"
															></path>
															<path
																stroke="currentColor"
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M16.5 13C16.5 13.2761 16.2761 13.5 16 13.5C15.7239 13.5 15.5 13.2761 15.5 13C15.5 12.7239 15.7239 12.5 16 12.5C16.2761 12.5 16.5 12.7239 16.5 13Z"
															></path>
															<path
																stroke="currentColor"
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="1.5"
																d="M17.25 8.25H6.5C5.5335 8.25 4.75 7.4665 4.75 6.5C4.75 5.5335 5.5335 4.75 6.5 4.75H15.25C16.3546 4.75 17.25 5.64543 17.25 6.75V8.25ZM17.25 8.25H19.25"
															></path>
														</svg>
													</div>
												</motion.button>
											</div>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					</div>
					<div className="w-3/5">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', stiffness: 100 }}
							className="bg-white mt-4 rounded-md shadow-sm w-full"
						>
							<div className="flex space-x-4 items-start">
								<div className="flex items-start justify-center space-x-4 p-6">
									<div className="w-full">
										<div className="flex items-center space-x-4">
											<div>
												<img className="w-12 rounded-full border-4 border-[#ededed]" src={pfp} alt="Profile" />
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
														<div className="w-full rounded-md" key={embed.id}>
															<iframe src={embed?.url} className="w-full h-96" />
														</div>
													);
												}
											})}
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
