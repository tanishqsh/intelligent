import { AnimatePresence, motion } from 'framer-motion';
import DurationSelector from '../Overview/DurationSelector';
import { useDuration } from '../DurationContext';
import { formatTimestamp, getDurationString, getRelativeTime } from '../TopCasts/utils';
import { usePrivy } from '@privy-io/react-auth';
import useImpactFollowers from '../hooks/useImpactFollowers';
import colors from '@/utils/colors';

export default function ImpactFollowers() {
	const { duration } = useDuration();
	const { user } = usePrivy();

	const fid = user?.farcaster?.fid?.toString() || '';
	const { impactFollowers } = useImpactFollowers(fid, duration);

	// console.log(impactFollowers);

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="bg-white rounded-lg shadow-xs"
		>
			<div className="text-xs py-4 px-4 border-b border-neutral-100 flex items-center justify-between">
				<span className="px-1 text-neutral-400 text-sm font-inter">Impact Followers (10K+) </span>
				<DurationSelector placement="impactfollowers" />
			</div>
			<div className="space-y-0 flex flex-col max-h-[600px] overflow-scroll divide-y divide-dotted shadow-sm">
				{impactFollowers.length == 0 && <span className="px-4 py-4 text-sm text-neutral-500/50 m-auto"> No new impact followers </span>}
				{impactFollowers.map((follower: any, i: number) => {
					let display_name = follower?.display_name;
					let follower_count = follower?.follower_count;
					let follower_fid = follower?.follower_fid;
					let username = follower?.username;
					let warpcast_URL = 'https://warpcast.com/' + username;
					let pfp = follower?.pfp;
					let follow_timestamp = follower?.follow_timestamp;

					const relativeTime = getRelativeTime(follow_timestamp);
					const formattedTimestamp = formatTimestamp(follow_timestamp);

					return (
						<div key={i}>
							<AnimatePresence mode="wait">
								<motion.div
									onClick={() => window.open(warpcast_URL, '_blank')}
									initial={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
									animate={{ opacity: 1, y: 0, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
									exit={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
									whileHover={{
										paddingTop: 24,
										paddingBottom: 24,
										backgroundColor: colors.neutral[100],
									}}
									transition={{ type: 'spring', stiffness: 200, damping: 20 }}
									className="px-4 cursor-pointer"
									key={follower_fid}
								>
									<div className="flex space-x-4 items-center">
										<img src={follower?.pfp} className="w-10 h-10 rounded-full" />
										<div>
											<div className="text-neutral-600 text-[14px] font-sans whitespace-pre-wrap possible-link break-words">
												{follower?.display_name}
											</div>
											<div className="text-neutral-400 text-[12px] font-sans whitespace-pre-wrap possible-link break-words">
												{follower?.follower_count} followers
											</div>
											<div className="text-neutral-400 text-[12px] font-sans whitespace-pre-wrap possible-link break-words">
												followed you {relativeTime}
											</div>
										</div>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</motion.div>
	);
}
