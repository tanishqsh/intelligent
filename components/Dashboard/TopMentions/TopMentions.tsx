import { motion } from 'framer-motion';
import DurationSelector from '../Overview/DurationSelector';
import { useDuration } from '../DurationContext';
import { usePrivy } from '@privy-io/react-auth';
import useTopMentions from '../hooks/useTopMentions';
import TopMentionPreview from './TopMentionPreview';
import useGetFid from '../hooks/useGetFid';

const TopMentions = () => {
	const { duration } = useDuration();
	const { user } = usePrivy();
	const { fid } = useGetFid({});
	const { data } = useTopMentions(fid, duration);

	const pfp = user?.farcaster?.pfp || 'https://placehold.co/48x48';

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className='rounded-xl shadow-xs'
		>
			<div className='text-xs py-4 border-b border-neutral-100 flex items-center justify-between'>
				<span className='text-neutral-400 text-sm font-inter'>Top Mentions</span>
				<DurationSelector placement='topmentions' />
			</div>
			<div className='space-y-2 flex flex-col max-h-[600px] custom-scrollbar overflow-scroll rounded-xl'>
				{data?.map((cast: any, i: number) => {
					return (
						<div key={i}>
							<TopMentionPreview i={i} cast={cast} />
						</div>
					);
				})}
			</div>
		</motion.div>
	);
};

export default TopMentions;
