'use client';

import SearchBar from '@/components/CastAnalyze/SearchBar';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useEffect, useState } from 'react';

/** Sample Data */
import { SampleCastWithVideo, SampleWarpcastURL } from './sample-state';
import LikeSVG from '@/components/CastAnalyze/SVG/LikeSVG';
import RecastSVG from '@/components/CastAnalyze/SVG/RecastSVG';
import ReplySVG from '@/components/CastAnalyze/SVG/ReplySVG';
import ClockSVG from '@/components/CastAnalyze/SVG/ClockSVG';
import toast from 'react-hot-toast';
import Clock24SVG from '@/components/CastAnalyze/SVG/Clock24SVG';
import colors from '@/utils/colors';
import CastPreview from './CastPreview';
import RecastsTab from './RecastsTab';
import CastStatsTab from './CastStatsTab';

dayjs.extend(relativeTime);

export default function CastAnalyze() {
	const [cast, setCast] = useState<any>(SampleCastWithVideo);
	const [castUrl, setCastUrl] = useState(SampleWarpcastURL);
	const [isLoaded, setIsLoaded] = useState(true);

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
		console.log('Copied addresses:', addresses);
		toast.success('Copied all addresses', {
			style: {
				background: colors.neutral[50],
				color: colors.neutral[600],
				borderRadius: '6px',
				fontSize: '0.8rem',
			},
			iconTheme: {
				primary: colors.neutral[100],
				secondary: colors.neutral[600],
			},
		});
	};

	const castStats = [
		{
			icon: <ClockSVG className="w-5 h-5 text-neutral-300" />,
			label: 'Posted on',
			value: dayjs(timestamp).format('MMM D, YYYY'),
			valueClassName: 'text-xs normal-case text-neutral-600',
		},
		{
			icon: <Clock24SVG className="w-5 h-5 text-neutral-300" />,
			label: 'Age',
			value: dayjs(timestamp).fromNow(),
			valueClassName: 'text-xs normal-case text-neutral-600',
		},
		{
			icon: <LikeSVG className="w-5 h-5 text-neutral-300" />,
			label: 'Likes',
			value: likes_count,
			valueClassName: 'text-xs text-neutral-600',
		},
		{
			icon: <ReplySVG className="w-5 h-5 text-neutral-300" />,
			label: 'Replies',
			value: replies,
			valueClassName: 'text-xs text-neutral-600',
		},
		{
			icon: <RecastSVG className="w-5 h-5 text-neutral-300" />,
			label: 'Recasts',
			value: recasts_count,
			valueClassName: 'text-xs text-neutral-600',
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
		<div className="bg-neutral-100 min-h-screen pb-[100px]">
			<div className="max-w-5xl m-auto">
				<div className="pt-4">
					<SearchBar isLoaded={isLoaded} castUrl={castUrl} setCastUrl={setCastUrl} fetchCast={fetchCast} />
				</div>
				{isLoaded && (
					<div className="w-full md:flex items-start md:space-x-4">
						<div className="mt-4 w-full md:w-2/6">
							<CastStatsTab castStats={castStats} />
							<RecastsTab recasts={recasts} copyAllAddresses={copyAllAddresses} />
						</div>
						<div className="w-full md:w-4/6">
							<CastPreview pfp={pfp} display_name={display_name} username={username} text={text} embeds={embeds} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
