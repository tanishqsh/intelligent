import useTopCasts from '../hooks/useTopCasts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { useDuration } from '../DurationContext';
import DurationSelector from '../Overview/DurationSelector';
import TopCastPreview from './TopCastPreview';
import { getDurationString } from './utils';

dayjs.extend(relativeTime);

export default function TopCasts() {
	const { duration } = useDuration();
	const { user } = usePrivy();
	const fid = user?.farcaster?.fid?.toString() || '';
	const { data } = useTopCasts(fid, duration);
	if (!data) return null;

	let durationString = getDurationString(duration);
	const pfp = user?.farcaster?.pfp || 'https://placehold.co/48x48';

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="rounded-xl shadow-xs"
		>
			<div className="text-xs py-4 px-4 border-b border-neutral-100 flex items-center justify-between">
				<span className="px-1 text-neutral-400 text-sm font-inter">Top {data?.length} performing casts</span>
				<DurationSelector placement="topcasts" />
			</div>
			<div className="space-y-2 flex flex-col max-h-[600px] overflow-scroll no-scrollbar rounded-xl">
				{data?.map((cast: any, i: number) => {
					return (
						<div key={i}>
							<TopCastPreview pfp={pfp} cast={cast} i={i} />
						</div>
					);
				})}
			</div>
		</motion.div>
	);
}
