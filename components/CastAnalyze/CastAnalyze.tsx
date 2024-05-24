'use client';

import SearchBar from '@/components/CastAnalyze/SearchBar/SearchBar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { useEffect, useState } from 'react';

/** Sample Data */
import { SampleCastWithVideo, SampleWarpcastURL } from './sample-state';
import LikeSVG from '@/components/CastAnalyze/SVG/LikeSVG';
import RecastSVG from '@/components/CastAnalyze/SVG/RecastSVG';
import ReplySVG from '@/components/CastAnalyze/SVG/ReplySVG';
import ClockSVG from '@/components/CastAnalyze/SVG/ClockSVG';
import Clock24SVG from '@/components/CastAnalyze/SVG/Clock24SVG';
import CastPreview from './CastPreview';
import RecastsTab from './RecastsTab';
import CastStatsTab from './CastStatsTab';
import ClockEmptySVG from './SVG/ClockEmptySVG';
import { fetchCast } from '@/lib/backend/fetchCast';

import RepliesTab from './RepliesTab';
import LikesTab from './LikesTab';
import { usePrivy } from '@privy-io/react-auth';
import CastActions from './CastActions';
import copyAllAddresses from './utils/copyAddressArray';
import useRepliesData from './hooks/useRepliesData';
import useReactionData from './hooks/useReactionData';
import useAlfaFrensData from './hooks/useAlfaFrensData';

export default function CastAnalyze() {
	const { ready, authenticated, user, getAccessToken } = usePrivy();

	const [cast, setCast] = useState<any>();
	const [castUrl, setCastUrl] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [listenerActive, setListenerActive] = useState<boolean>(false);

	// alfafrens data
	const [useAlfaFrensFiltering, setUseAlfaFrensFiltering] = useState<boolean>(false);
	const [filteredReplies, setFilteredReplies] = useState<any[]>([]);
	const [filteredLikes, setFilteredLikes] = useState<any[]>([]);
	const [filteredRecasts, setFilteredRecasts] = useState<any[]>([]);

	// call replies and reactions hook
	const { replies } = useRepliesData(listenerActive, cast, isLoaded);
	const { likes, recasts } = useReactionData(listenerActive, cast, isLoaded);
	const { members } = useAlfaFrensData(listenerActive, String(user?.farcaster?.fid || ''), isLoaded);

	const beginFetchCast = async (): Promise<void> => {
		const accessToken = (await getAccessToken()) || '';
		const data = await fetchCast(castUrl, accessToken);
		if (data.success) {
			setCast(data.cast);
			setIsLoaded(true);
			startListener();
		}
	};

	useEffect(() => {
		console.log('members', members);
	}, [members]);

	useEffect(() => {
		// filter replies, likes, and recasts
		if (useAlfaFrensFiltering && members?.length > 0) {
			const filteredReplies = replies.filter((reply) => {
				//@ts-ignore
				let found = members?.find((member: any) => member.fid === reply?.fid && member.isSubscribed);
				if (found) {
					found = { ...found, isSubscribed: true }; // Adding the key member.isSubscribed
				}
				return found;
			});
			setFilteredReplies(filteredReplies);

			const filteredLikes = likes.filter((like) => {
				//@ts-ignore
				let found = members?.find((member: any) => member.fid === like?.reactedBy?.userId && member.isSubscribed);
				if (found) {
					found = { ...found, isSubscribed: true }; // Adding the key member.isSubscribed
				}
				return found;
			});
			setFilteredLikes(filteredLikes);

			const filteredRecasts = recasts.filter((recast) => {
				//@ts-ignore
				let found = members?.find((member: any) => member.fid === recast?.reactedBy?.userId && member.isSubscribed);
				if (found) {
					found = { ...found, isSubscribed: true }; // Adding the key member.isSubscribed
				}
				return found;
			});
			setFilteredRecasts(filteredRecasts);
		}
	}, [replies, likes, recasts, useAlfaFrensFiltering, members]);

	const startListener = () => {
		setListenerActive(true);
	};

	// about caster
	const username = cast?.castedBy?.profileHandle;
	const pfp = cast?.castedBy?.profileImage;
	const display_name = cast?.castedBy?.profileDisplayName;

	// about cast
	const text = cast?.text; // this should be rendered so that \n can be rendered as line
	const timestamp = cast?.castedAtTimestamp;
	const embeds = cast?.embeds;
	const hash = cast?.hash;

	// stats
	const likes_count = cast?.numberOfLikes || 0;
	const recasts_count = cast?.numberOfRecasts || 0;
	const replies_count = cast?.numberOfReplies || 0;

	const castStats = [
		{
			icon: <ClockEmptySVG className="w-5 h-5 text-neutral-300" />,
			label: 'Last synced',
			value: dayjs(new Date()).fromNow(),
			valueClassName: 'text-xs normal-case text-neutral-600',
		},
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
			value: replies_count,
			valueClassName: 'text-xs text-neutral-600',
		},
		{
			icon: <RecastSVG className="w-5 h-5 text-neutral-300" />,
			label: 'Recasts',
			value: recasts_count,
			valueClassName: 'text-xs text-neutral-600',
		},
	];

	return (
		<div className="bg-neutral-100 min-h-screen pb-[100px]">
			<div className="max-w-5xl m-auto">
				<div className="pt-4">
					<SearchBar setIsLoading={setIsLoading} isLoaded={isLoaded} castUrl={castUrl} setCastUrl={setCastUrl} beginFetchCast={beginFetchCast} />
				</div>
				{isLoaded && (
					<div className="w-full md:flex items-start md:space-x-4">
						<div className="mt-4 w-full md:w-2/6 space-y-4">
							<CastStatsTab castStats={castStats} />
							<CastActions useAlfaFrensFiltering={useAlfaFrensFiltering} setUseAlfaFrensFiltering={setUseAlfaFrensFiltering} />
							<RecastsTab recasts={useAlfaFrensFiltering ? filteredRecasts : recasts} copyAllAddresses={copyAllAddresses} />
							<LikesTab likes={useAlfaFrensFiltering ? filteredLikes : likes} copyAllAddresses={copyAllAddresses} />
						</div>
						<div className="w-full md:w-4/6">
							<CastPreview pfp={pfp} display_name={display_name} username={username} text={text} embeds={embeds} />
							<div className="mt-4">
								<RepliesTab replies={useAlfaFrensFiltering ? filteredReplies : replies} copyAllAddresses={copyAllAddresses} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
