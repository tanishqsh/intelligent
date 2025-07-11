import { AnimatePresence, motion } from 'framer-motion';
import DurationSelector from '../Overview/DurationSelector';
import { useDuration } from '../DurationContext';
import { formatTimestamp, getDurationString, getRelativeTime } from '../TopCasts/utils';
import { usePrivy } from '@privy-io/react-auth';
import useImpactFollowers from '../hooks/useImpactFollowers';
import colors from '@/utils/colors';
import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';
import useGetFid from '../hooks/useGetFid';

export default function ImpactFollowers() {
	const { duration } = useDuration();
	const { fid } = useGetFid({});
	const { impactFollowers } = useImpactFollowers(fid, duration);

	// remove duplicates from impactFollowers
	const uniqueImpactFollowers = impactFollowers.reduce((acc: any, follower: any) => {
		const foundIndex = acc.findIndex((t: any) => t.follower_fid === follower.follower_fid);
		if (foundIndex === -1) {
			follower.count = 1;
			acc.push(follower);
		} else {
			acc[foundIndex].count += 1;
		}
		return acc;
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className='rounded-xl shadow-xs'
		>
			<div className='text-xs py-4 border-b border-neutral-100 flex items-center justify-between'>
				<ExplainUI text='People with over 10,000 followers'>
					<div className='flex space-x-1'>
						<span className='px-1 text-neutral-400 hover:text-neutral-500 text-sm font-inter'>
							{uniqueImpactFollowers?.length > 9 && <span>Top</span>} {uniqueImpactFollowers?.length} Impact follower
							{uniqueImpactFollowers?.length === 1 ? '' : 's'}
						</span>
						<svg className='size-5 text-neutral-400 hover:text-neutral-500' fill='none' viewBox='0 0 24 24'>
							<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 13V15'></path>
							<circle cx='12' cy='9' r='1' fill='currentColor'></circle>
							<circle cx='12' cy='12' r='7.25' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5'></circle>
						</svg>
					</div>
				</ExplainUI>
				<DurationSelector placement='impactfollowers' />
			</div>
			<div className='space-y-1 flex flex-col max-h-[600px] no-scrollbar overflow-scroll rounded-xl'>
				{uniqueImpactFollowers.length == 0 && (
					<motion.div
						initial={{ opacity: 0, y: 4, paddingTop: 32, paddingBottom: 32 }}
						animate={{ opacity: 1, y: 0, paddingTop: 32, paddingBottom: 32 }}
						transition={{ duration: 0.3 }}
						className='px-4 py-4 bg-neutral-200/50 border-2 border-dotted border-black/10 rounded-xl'
					>
						<span className='text-sm text-neutral-500/50 m-auto'> No new impact followers </span>
					</motion.div>
				)}
				{uniqueImpactFollowers.map((follower: any, i: number) => {
					let follower_count = follower?.follower_count;
					let follower_fid = follower?.follower_fid;
					let display_name = follower?.display_name || 'FID ' + follower_fid + '';
					let username = follower?.username;
					let warpcast_URL = username ? 'https://warpcast.com/' + username : '/warpcast/' + follower_fid;
					username = username || 'someone';
					let pfp = follower?.pfp || 'https://avatar.iran.liara.run/public?id=' + follower_fid;
					let follow_timestamp = follower?.follow_timestamp;

					const relativeTime = getRelativeTime(follow_timestamp);
					const formattedTimestamp = formatTimestamp(follow_timestamp);
					// how many times did this follower follow you

					const followedTimes = follower?.count;
					const followedMoreThanOnce = followedTimes > 1;

					return (
						<div key={'impact_follower_' + i}>
							<AnimatePresence mode='wait'>
								<motion.div
									onClick={() => window.open(warpcast_URL, '_blank')}
									initial={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
									animate={{ opacity: 1, y: 0, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
									exit={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
									whileHover={{
										paddingTop: 24,
										paddingBottom: 24,
										backgroundColor: colors.neutral[50],
									}}
									layoutId={follower_fid}
									transition={{ type: 'spring', stiffness: 200, damping: 20 }}
									className='px-4 cursor-pointer rounded-xl shadow-sm'
									key={follower_fid}
								>
									<div className='flex space-x-4 items-start'>
										<img
											src={pfp}
											alt='Follower Profile Picture'
											style={{
												objectFit: 'cover',
												objectPosition: 'center',
											}}
											className='w-10 h-10 rounded-full ring-2 ring-black/10'
										/>
										<div>
											<div className='text-neutral-600 text-[14px] font-sans whitespace-pre-wrap possible-link break-words'>
												{display_name}
											</div>
											<div className='text-neutral-400 text-[12px] font-sans whitespace-pre-wrap possible-link break-words'>
												{follower_count} followers
											</div>
											<div className='text-neutral-400 text-[12px] font-sans whitespace-pre-wrap possible-link break-words'>
												followed you {relativeTime}
											</div>
											{followedMoreThanOnce && (
												<ExplainUI
													text='
												This usually happens when a user follows you, unfollows you, and then follows you again.'
												>
													<div className='mt-2 text-amber-700 text-[12px] font-sans whitespace-pre-wrap possible-link break-words'>
														@{username} followed you {followedTimes} times.
													</div>
												</ExplainUI>
											)}
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
