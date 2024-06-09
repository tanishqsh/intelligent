import useTopCasts from '../hooks/useTopCasts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence, motion } from 'framer-motion';
import Duration from '../Overview/Duration';
import { usePrivy } from '@privy-io/react-auth';
import { useDuration } from '../DurationContext';
import colors from '@/utils/colors';
import DurationSelector from '../Overview/DurationSelector';
import Linkify from 'react-linkify';
import VideoPlayer from '@/components/VideoPlayer';

dayjs.extend(relativeTime);

export default function TopCasts() {
	const { duration } = useDuration();

	const { user } = usePrivy();

	const fid = user?.farcaster?.fid?.toString() || '';

	const { data } = useTopCasts(fid, duration);

	if (!data) return null;

	console.log(`Top Casts–${duration}: `, data);

	// duration to proper wording
	// 24h ->  24 Hours
	// 7d -> 7 Days

	let durationString = '';
	if (duration === Duration.HOURS_24) {
		durationString = 'last 24 hours';
	} else if (duration === Duration.DAYS_7) {
		durationString = 'last 7 days';
	} else if (duration === Duration.DAYS_30) {
		durationString = 'last 30 days';
	} else if (duration === Duration.DAYS_180) {
		durationString = 'last 180 days';
	}

	const pfp = user?.farcaster?.pfp || 'https://placehold.co/48x48';

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="bg-white rounded-lg shadow-xs"
		>
			<div className="text-xs py-4 px-4 border-b border-neutral-100 flex items-center justify-between">
				<span className="px-1 text-neutral-400 text-sm font-inter">Top performing casts over the {durationString}</span>
				<DurationSelector placement="topcasts" />
			</div>

			<div className="space-y-0 flex flex-col max-h-[600px] overflow-scroll divide-y divide-dotted shadow-sm">
				{data?.map((cast: any, i: number) => {
					let parent_cast_fid = cast?.parent_cast_fid;
					let parent_cast_hash = cast?.parent_cast_hash;
					let parent_cast_url = cast?.parent_cast_url;
					let text = cast?.text;
					let engagement_count = cast?.engagement_count;
					let hash = cast?.cast_hash;
					let time = cast?.cast_time;
					let formattedTime = formatTimestamp(time);
					let relativeTime = getRelativeTime(time);
					let embeds = cast?.embeds;

					let isQuoteCast = embeds?.some((embed: any) => embed?.castId);

					return (
						<AnimatePresence mode="wait">
							<motion.div
								initial={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
								animate={{ opacity: 1, y: 0, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
								exit={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
								whileHover={{
									paddingTop: 24,
									paddingBottom: 24,
									backgroundColor: colors.neutral[100],
								}}
								transition={{ type: 'spring', stiffness: 200, damping: 20 }}
								className="px-4 cursor-default"
								key={hash}
							>
								<div className="flex space-x-4 items-start">
									<img src={pfp} className="w-10 h-10 rounded-full" />
									<div>
										<Linkify>
											<div className="text-neutral-600 text-[14px] font-sans whitespace-pre-wrap possible-link break-words">{text}</div>
										</Linkify>
										<div className="w-full m-auto h-auto flex items-center justify-start">
											{embeds?.map((embed: any, index: number) => {
												if (embed?.url?.endsWith('.m3u8')) {
													return (
														<div className="rounded-md w-[300px] aspect-video border-[10px] border-white shadow-md" key={index}>
															<VideoPlayer src={embed?.url} />
														</div>
													);
												} else if (embed?.url?.match(/\.(jpeg|jpg|gif|png)$/) || embed?.url?.includes('imagedelivery.net')) {
													return (
														<div className="mt-4" key={index}>
															<motion.img
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																whileHover={{ y: -10 }}
																className="rounded-md w-[350px] border-[10px] border-white shadow-md cursor-pointer"
																src={embed?.url}
																alt="Embed"
																onClick={() => window.open(embed?.url, '_blank')}
															/>
														</div>
													);
												} else {
													return <div className="w-full rounded-md" key={index}></div>;
												}
											})}
										</div>
										<div id="flairs" className="flex space-x-2">
											{i == 0 && (
												<div className="mt-4 font-medium text-amber-700 inline-flex items-center space-x-2 rounded-full bg-amber-500/5 px-2 py-1">
													<p className="text-xs">Most engaged</p>
													<svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path
															d="M6.75 16.75L4.75 6.75L9 9.25L12 4.75L15 9.25L19.25 6.75L17.25 16.75H6.75Z"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														></path>
														<path
															d="M17.25 16.75H6.75C5.64543 16.75 4.75 17.6454 4.75 18.75V19.25H19.25V18.75C19.25 17.6454 18.3546 16.75 17.25 16.75Z"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														></path>
													</svg>
												</div>
											)}
											<div className="mt-4 font-medium text-emerald-700 inline-flex items-center space-x-2 rounded-full bg-emerald-700/5 px-2 py-1">
												<p className="text-xs">{engagement_count}</p>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3">
													<path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
												</svg>
											</div>
											<div className="mt-4 font-medium text-neutral-500 inline-flex items-center space-x-2 rounded-full bg-neutral-700/5 px-2 py-1">
												<p className="text-xs">{formattedTime}</p>
												<p className="text-xs opacity-50">{relativeTime}</p>
											</div>
											{parent_cast_hash && (
												<div className="mt-4 font-medium text-amber-700 inline-flex items-center space-x-2 rounded-full bg-amber-700/5 px-2 py-1">
													<p className="text-xs">Reply</p>
													<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
														<path
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.5"
															d="M6.75 19.25s1.575-2.5 5.25-2.5 5.25 2.5 5.25 2.5M12 4.75v.5m3.625.471-.25.433m2.904 2.22-.433.25M19.25 12h-.5m-.471 3.625-.433-.25m-11.692 0-.433.25M5.25 12h-.5m1.404-3.375-.433-.25m2.904-2.22-.25-.434M14.25 12a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
														></path>
													</svg>
												</div>
											)}
											{isQuoteCast && (
												<div className="mt-4 font-medium text-neutral-700 inline-flex items-center space-x-2 rounded-full bg-neutral-700/5 px-2 py-1">
													<p className="text-xs">Quote Cast</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					);
				})}
			</div>
		</motion.div>
	);
}

const formatTimestamp = (timestamp: { seconds: number; nanoseconds: number }) => {
	const date = dayjs.unix(timestamp.seconds);
	return date.format('ddd, D MMMM YY hh:mm:ss A');
};

const getRelativeTime = (timestamp: { seconds: number; nanoseconds: number }) => {
	const date = new Date(timestamp.seconds * 1000);
	return dayjs(date).fromNow();
};
