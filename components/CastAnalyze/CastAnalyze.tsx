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
import toast from 'react-hot-toast';
import Clock24SVG from '@/components/CastAnalyze/SVG/Clock24SVG';
import CastPreview from './CastPreview';
import RecastsTab from './RecastsTab';
import CastStatsTab from './CastStatsTab';
import ClockEmptySVG from './SVG/ClockEmptySVG';
import { motion } from 'framer-motion';
import { fetchCast } from '@/lib/backend/fetchCast';

// firebase
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import firestore from '@/lib/firebase/firestore';
import RepliesTab from './RepliesTab';
import LikesTab from './LikesTab';
import toastStyles from '@/utils/toastStyles';
import { usePrivy } from '@privy-io/react-auth';
import { fetchAlfaFrensData } from '@/lib/backend/fetchAlfaFrensData';

interface FirestoreData {
	id: string;
	reactionType?: 'like' | 'recast';
	[key: string]: any;
}

export default function CastAnalyze() {
	const { ready, authenticated, login, logout, user } = usePrivy();

	const [cast, setCast] = useState<any>();
	const [castUrl, setCastUrl] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	// listener stores replies
	const [replies, setReplies] = useState<any[]>([]);
	const [likes, setLikes] = useState<any[]>([]);
	const [recasts, setRecasts] = useState<any[]>([]);

	const [listenerStarted, setListenerStarted] = useState<boolean>(false);

	// alfafrens data
	const [alfaFrensData, setAlfaFrensData] = useState<any[]>([]);
	const [useAlfaFrensFiltering, setUseAlfaFrensFiltering] = useState<boolean>(false);
	const [filteredReplies, setFilteredReplies] = useState<any[]>([]);
	const [filteredLikes, setFilteredLikes] = useState<any[]>([]);
	const [filteredRecasts, setFilteredRecasts] = useState<any[]>([]);

	const beginFetchCast = async (): Promise<void> => {
		const data = await fetchCast(castUrl);
		if (data.success) {
			setCast(data.cast);
			setIsLoaded(true);
			startListener();
		}
	};

	const fetchAlfaFrens = async () => {
		if (user?.farcaster?.fid) {
			const data = await fetchAlfaFrensData(user?.farcaster?.fid);
			if (data.success) {
				setAlfaFrensData(data);
			}
		}
	};

	useEffect(() => {
		// filter replies, likes, and recasts
		if (useAlfaFrensFiltering && alfaFrensData) {
			const filteredReplies = replies.filter((reply) => {
				//@ts-ignore
				let found = alfaFrensData?.channelData?.members?.find((member: any) => member.fid === reply?.fid && member.isSubscribed);
				if (found) {
					found = { ...found, isSubscribed: true }; // Adding the key member.isSubscribed
				}
				return found;
			});
			setFilteredReplies(filteredReplies);

			const filteredLikes = likes.filter((like) => {
				//@ts-ignore
				let found = alfaFrensData?.channelData?.members?.find((member: any) => member.fid === like?.reactedBy?.userId && member.isSubscribed);
				if (found) {
					found = { ...found, isSubscribed: true }; // Adding the key member.isSubscribed
				}
				return found;
			});
			setFilteredLikes(filteredLikes);

			const filteredRecasts = recasts.filter((recast) => {
				//@ts-ignore
				let found = alfaFrensData?.channelData?.members?.find((member: any) => member.fid === recast?.reactedBy?.userId && member.isSubscribed);
				if (found) {
					found = { ...found, isSubscribed: true }; // Adding the key member.isSubscribed
				}
				return found;
			});
			setFilteredRecasts(filteredRecasts);
		}
	}, [replies, likes, recasts, useAlfaFrensFiltering, alfaFrensData]);

	// this useEffect just fetches data from AlfaFrens, temporary,  will move to a separate component, and probably use a hook

	useEffect(() => {
		if (ready && authenticated) {
			if (user?.farcaster?.fid) {
				fetchAlfaFrens();
			}
		}
	}, [ready, authenticated, user]);

	useEffect(() => {
		let unsubscribeReplies: (() => void) | undefined;
		if (listenerStarted && cast && isLoaded) {
			const q = query(collection(firestore, 'replies'), where('parentHash', '==', cast.hash));

			unsubscribeReplies = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
				const newData = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setReplies(newData);
			});
		}

		return () => {
			if (unsubscribeReplies) unsubscribeReplies();
		};
	}, [listenerStarted, cast, isLoaded]);

	useEffect(() => {
		let unsubscribeReactions: (() => void) | undefined;

		if (listenerStarted && cast && isLoaded) {
			const reactionsCollectionPath = `casts/${cast.hash}/reactions`;
			const reactionsCollection = collection(firestore, reactionsCollectionPath);
			unsubscribeReactions = onSnapshot(reactionsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
				const newLikes: FirestoreData[] = [];
				const newRecasts: FirestoreData[] = [];

				snapshot.docs.forEach((doc) => {
					const data: FirestoreData = {
						id: doc.id,
						...doc.data(),
					};

					if (data.reactionType === 'like') {
						newLikes.push(data);
					} else if (data.reactionType === 'recast') {
						newRecasts.push(data);
					}
				});

				setLikes(newLikes);
				setRecasts(newRecasts);
			});
		}

		return () => {
			if (unsubscribeReactions) unsubscribeReactions();
		};
	}, [listenerStarted, cast, isLoaded]);

	const startListener = () => {
		setListenerStarted(true);
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

	const copyAllAddresses = (type: string) => {
		let addresses: string[] = []; // Ensure addresses is initialized

		let likesArray = useAlfaFrensFiltering ? filteredLikes : likes;
		let recastsArray = useAlfaFrensFiltering ? filteredRecasts : recasts;
		let repliesArray = useAlfaFrensFiltering ? filteredReplies : replies;

		if (type === 'likes') {
			addresses = Array.from(
				new Set(
					likesArray
						.map((like) => {
							const connectedWalletAddress =
								like?.reactedBy?.connectedAddresses &&
								like.reactedBy.connectedAddresses.length > 0 &&
								like.reactedBy.connectedAddresses[0].blockchain === 'ethereum'
									? like.reactedBy.connectedAddresses[0].address
									: null;
							return connectedWalletAddress;
						})
						.filter((address) => address !== null) // Filter out null addresses
				)
			);
		} else if (type === 'recasts') {
			addresses = Array.from(
				new Set(
					recastsArray
						.map((recast) => {
							const connectedWalletAddress =
								recast?.reactedBy?.connectedAddresses &&
								recast.reactedBy.connectedAddresses.length > 0 &&
								recast.reactedBy.connectedAddresses[0].blockchain === 'ethereum'
									? recast.reactedBy.connectedAddresses[0].address
									: null;
							return connectedWalletAddress;
						})
						.filter((address) => address !== null) // Filter out null addresses
				)
			);
		} else if (type === 'replies') {
			addresses = Array.from(
				new Set(
					repliesArray
						.map((reply) => {
							const connectedWalletAddress =
								reply?.castedBy?.connectedAddresses &&
								reply.castedBy.connectedAddresses.length > 0 &&
								reply.castedBy.connectedAddresses[0].blockchain === 'ethereum'
									? reply.castedBy.connectedAddresses[0].address
									: null;
							return connectedWalletAddress;
						})
						.filter((address) => address !== null) // Filter out null addresses
				)
			);
		}

		const arrayLength = addresses.length;
		navigator.clipboard.writeText(addresses.join('\n'));
		toast.success(`Found ${arrayLength} verified ethereum addresses. Copied to clipboard. `, toastStyles.success);
	};

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

const CastActions = ({
	useAlfaFrensFiltering,
	setUseAlfaFrensFiltering,
}: {
	useAlfaFrensFiltering: boolean;
	setUseAlfaFrensFiltering: (value: boolean) => void;
}) => {
	return (
		<div>
			<motion.div
				initial={{ opacity: 1, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', stiffness: 100 }}
				className="shadow-sm bg-white font-inter rounded-md uppercase font-medium divide-y divide-dotted"
			>
				<div className={`font-medium inline-flex text-xs w-full py-2 px-2 justify-between items-center rounded-t-md`}>
					<div className="flex items-center space-x-2">
						<img className="w-4" src="/alfa.png" />
						<span className="font-semibold text-neutral-400 text-xs">Filter AlfaFrens Subscibers</span>
					</div>
					<input
						onChange={(e) => setUseAlfaFrensFiltering(e.target.checked)}
						type="checkbox"
						checked={useAlfaFrensFiltering}
						className="h-4 w-4 text-purple-600"
					/>
				</div>
			</motion.div>
		</div>
	);
};
