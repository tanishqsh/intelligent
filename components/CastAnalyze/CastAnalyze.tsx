'use client';

import SearchBar from '@/components/CastAnalyze/SearchBar/SearchBar';
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
import LikesTab from './LikesTab';
import toastStyles from '@/utils/toastStyles';

interface FirestoreData {
	id: string;
	reactionType?: 'like' | 'recast';
	[key: string]: any;
}

export default function CastAnalyze() {
	const [cast, setCast] = useState<any>();
	const [castUrl, setCastUrl] = useState('');
	const [isLoaded, setIsLoaded] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	// listener stores replies
	const [replies, setReplies] = useState<any[]>([]);
	const [likes, setLikes] = useState<any[]>([]);
	const [recasts, setRecasts] = useState<any[]>([]);

	const [listenerStarted, setListenerStarted] = useState<boolean>(false);

	const beginFetchCast = async (): Promise<void> => {
		const data = await fetchCast(castUrl);
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

		if (type === 'likes') {
			addresses = Array.from(
				new Set(
					likes
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
					recasts
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
					replies
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
		// {
		// 	icon: (
		// 		<svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		// 			<path
		// 				d="M6.99571 15.9586C7.38706 15.8229 7.59431 15.3956 7.45861 15.0043C7.32291 14.6129 6.89565 14.4057 6.50429 14.5414L6.99571 15.9586ZM17.4957 14.5414C17.1044 14.4057 16.6771 14.6129 16.5414 15.0043C16.4057 15.3956 16.6129 15.8229 17.0043 15.9586L17.4957 14.5414ZM18.5 17C18.5 16.9586 18.5253 17.0593 18.2366 17.2711C17.9633 17.4716 17.5198 17.6837 16.9042 17.8747C15.6822 18.2539 13.9482 18.5 12 18.5V20C14.0559 20 15.9469 19.7424 17.3488 19.3073C18.0453 19.0911 18.6635 18.8183 19.1239 18.4805C19.5689 18.154 20 17.6627 20 17H18.5ZM12 18.5C10.0518 18.5 8.31779 18.2539 7.09578 17.8747C6.48025 17.6837 6.03672 17.4716 5.76342 17.2711C5.47469 17.0593 5.5 16.9586 5.5 17H4C4 17.6627 4.43106 18.154 4.87606 18.4805C5.33651 18.8183 5.95471 19.0911 6.65118 19.3073C8.05315 19.7424 9.94409 20 12 20V18.5ZM5.5 17C5.5 17.0449 5.50359 16.897 5.81673 16.6197C6.09184 16.376 6.50374 16.1292 6.99571 15.9586L6.50429 14.5414C5.84825 14.7689 5.26015 15.1089 4.82226 15.4967C4.42241 15.8508 4 16.3788 4 17H5.5ZM17.0043 15.9586C17.4963 16.1292 17.9082 16.376 18.1833 16.6197C18.4964 16.897 18.5 17.0449 18.5 17H20C20 16.3788 19.5776 15.8508 19.1777 15.4967C18.7399 15.1089 18.1517 14.7689 17.4957 14.5414L17.0043 15.9586Z"
		// 				fill="currentColor"
		// 			></path>
		// 			<path
		// 				d="M16.5 6C16.5 5.72564 16.7089 5.69822 16.4695 5.83299C16.2913 5.93333 15.9836 6.04833 15.5386 6.15428C14.6605 6.36336 13.409 6.5 12 6.5V8C13.4905 8 14.864 7.85682 15.886 7.61349C16.3911 7.49323 16.8522 7.33888 17.2053 7.14012C17.4972 6.9758 18 6.61954 18 6H16.5ZM12 6.5C10.591 6.5 9.33953 6.36336 8.4614 6.15428C8.01641 6.04833 7.70872 5.93333 7.53048 5.83299C7.29106 5.69822 7.5 5.72564 7.5 6H6C6 6.61954 6.50275 6.9758 6.79467 7.14012C7.14775 7.33888 7.6089 7.49323 8.11397 7.61349C9.13598 7.85682 10.5095 8 12 8V6.5ZM7.5 6C7.5 6.27436 7.29106 6.30178 7.53048 6.16701C7.70872 6.06667 8.01641 5.95167 8.4614 5.84572C9.33953 5.63664 10.591 5.5 12 5.5V4C10.5095 4 9.13598 4.14318 8.11397 4.38651C7.6089 4.50677 7.14775 4.66112 6.79467 4.85988C6.50275 5.0242 6 5.38046 6 6H7.5ZM12 5.5C13.409 5.5 14.6605 5.63664 15.5386 5.84572C15.9836 5.95167 16.2913 6.06667 16.4695 6.16701C16.7089 6.30178 16.5 6.27436 16.5 6H18C18 5.38046 17.4972 5.0242 17.2053 4.85988C16.8522 4.66112 16.3911 4.50677 15.886 4.38651C14.864 4.14318 13.4905 4 12 4V5.5Z"
		// 				fill="currentColor"
		// 			></path>
		// 			<path
		// 				d="M18 15C18 14.5858 17.6642 14.25 17.25 14.25C16.8358 14.25 16.5 14.5858 16.5 15H18ZM7.5 15C7.5 14.5858 7.16421 14.25 6.75 14.25C6.33579 14.25 6 14.5858 6 15H7.5ZM16.5 15C16.5 14.7256 16.7089 14.6982 16.4695 14.833C16.2913 14.9333 15.9836 15.0483 15.5386 15.1543C14.6605 15.3634 13.409 15.5 12 15.5V17C13.4905 17 14.864 16.8568 15.886 16.6135C16.3911 16.4932 16.8522 16.3389 17.2053 16.1401C17.4972 15.9758 18 15.6195 18 15H16.5ZM12 15.5C10.591 15.5 9.33953 15.3634 8.4614 15.1543C8.01641 15.0483 7.70872 14.9333 7.53048 14.833C7.29106 14.6982 7.5 14.7256 7.5 15H6C6 15.6195 6.50275 15.9758 6.79467 16.1401C7.14775 16.3389 7.6089 16.4932 8.11397 16.6135C9.13598 16.8568 10.5095 17 12 17V15.5Z"
		// 				fill="currentColor"
		// 			></path>
		// 			<path
		// 				d="M7.5 6C7.5 5.58579 7.16421 5.25 6.75 5.25C6.33579 5.25 6 5.58579 6 6H7.5ZM6 15.25C6 15.6642 6.33579 16 6.75 16C7.16421 16 7.5 15.6642 7.5 15.25H6ZM6 6V15.25H7.5V6H6Z"
		// 				fill="currentColor"
		// 			></path>
		// 			<path
		// 				d="M18 6C18 5.58579 17.6642 5.25 17.25 5.25C16.8358 5.25 16.5 5.58579 16.5 6H18ZM16.5 15.25C16.5 15.6642 16.8358 16 17.25 16C17.6642 16 18 15.6642 18 15.25H16.5ZM16.5 6V15.25H18V6H16.5Z"
		// 				fill="currentColor"
		// 			></path>
		// 		</svg>
		// 	),
		// 	label: 'DEGEN Tips',
		// 	value: (
		// 		<div>
		// 			259 $DEGEN <span className="text-neutral-500">($5.18)</span>
		// 		</div>
		// 	),
		// 	valueClassName: 'text-xs text-neutral-600',
		// },
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

							<RecastsTab recasts={recasts} copyAllAddresses={copyAllAddresses} />
							<LikesTab likes={likes} copyAllAddresses={copyAllAddresses} />
						</div>
						<div className="w-full md:w-4/6">
							<CastPreview pfp={pfp} display_name={display_name} username={username} text={text} embeds={embeds} />
							<div className="mt-4">
								<RepliesTab replies={replies} copyAllAddresses={copyAllAddresses} />
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
