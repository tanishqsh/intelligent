'use client';

import SearchBar from '@/components/CastAnalyze/SearchBar';
import axios from 'axios';
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
import colors from '@/utils/colors';
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

interface FirestoreData {
	id: string;
	reactionType?: 'like' | 'recast';
	[key: string]: any;
}

export default function CastAnalyze() {
	const [cast, setCast] = useState<any>();
	const [lastSynced, setLastSynced] = useState<any>(null);
	const [castUrl, setCastUrl] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);

	// listener stores replies
	const [replies, setReplies] = useState<any[]>([]);
	const [likes, setLikes] = useState<any[]>([]);
	const [recasts, setRecasts] = useState<any[]>([]);

	const [listenerStarted, setListenerStarted] = useState<boolean>(false);

	useEffect(() => {
		if (castUrl) {
			console.log(castUrl);
		}
	}, [castUrl]);

	const beginfetchCast = async () => {
		const data = await fetchCast(castUrl);
		console.log('Data in Frontend Component:', data);
		if (data.success) {
			setCast(data.cast);
			setIsLoaded(true);
			startListener();
		}
	};

	useEffect(() => {
		let unsubscribeReplies: (() => void) | undefined;
		if (listenerStarted && cast && isLoaded) {
			const q = query(collection(firestore, 'replies'), where('parentHash', '==', cast.hash));

			unsubscribeReplies = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
				const newData = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log('New data:', newData);
				setReplies(newData);
			});
		}

		return () => {
			if (unsubscribeReplies) unsubscribeReplies();
		};
	}, [listenerStarted]);

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

				console.log('New likes:', newLikes);
				console.log('New recasts:', newRecasts);

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
			icon: <ClockEmptySVG className="w-5 h-5 text-neutral-300" />,
			label: 'Last synced',
			value: dayjs(lastSynced).fromNow(),
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
					<SearchBar isLoaded={isLoaded} castUrl={castUrl} setCastUrl={setCastUrl} fetchCast={beginfetchCast} />
				</div>
				{isLoaded && (
					<div className="w-full md:flex items-start md:space-x-4">
						<div className="mt-4 w-full md:w-2/6 space-y-4">
							<CastStatsTab castStats={castStats} />
							<RecastsTab recasts={recasts} copyAllAddresses={copyAllAddresses} />
						</div>
						<div className="w-full md:w-4/6">
							<CastPreview pfp={pfp} display_name={display_name} username={username} text={text} embeds={embeds} />
							<div className="mt-4">
								<RepliesTab replies={replies} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

const CastActions = ({
	isConstantSyncOn,
	setIsConstantSyncOn,
}: {
	isConstantSyncOn: boolean;
	setIsConstantSyncOn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div>
			<motion.div
				initial={{ opacity: 1, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', stiffness: 100 }}
				className="shadow-sm bg-white font-inter rounded-md uppercase font-medium divide-y divide-dotted"
			>
				<motion.div
					initial={{ opacity: 0, y: 20, paddingTop: 10, paddingBottom: 10 }}
					animate={{ opacity: 1, y: 0, paddingTop: 10, paddingBottom: 10 }}
					whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
					transition={{ type: 'spring', stiffness: 100 }}
					className={`font-medium text-xs w-full py-2 px-2 justify-between flex items-center rounded-t-md`}
				>
					<div className="flex items-center space-x-2">
						{isConstantSyncOn ? (
							<button onClick={() => setIsConstantSyncOn(!isConstantSyncOn)}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-300">
									<path
										fillRule="evenodd"
										d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						) : (
							<button onClick={() => setIsConstantSyncOn(!isConstantSyncOn)}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-300">
									<path
										fillRule="evenodd"
										d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						)}

						<span className="font-semibold text-neutral-400 text-xs">
							Live sync
							{isConstantSyncOn ? <span> ON </span> : <span> OFF</span>}
						</span>
					</div>
					<div className={`h-2 w-2 rounded-full ${isConstantSyncOn ? 'bg-green-500' : 'bg-neutral-300'}`}></div>
				</motion.div>
			</motion.div>
		</div>
	);
};
