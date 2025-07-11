'use client';

import { usePrivy } from '@privy-io/react-auth';
import EngagementChart from './EngagementChart';
import { useChartData } from './hooks/useChartData';
import Overview from './Overview/Overview';
import { useDuration } from './DurationContext';
import { AnimatePresence, motion } from 'framer-motion';
import TopCasts from './TopCasts/TopCasts';
import ImpactFollowers from './ImpactFollowers/ImpactFollowers';
import { useSetLastActive } from './hooks/useSetLastActive';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ImpactUnfollowers from './ImpactUnfollowers/ImpactUnfollowers';
import TopMentions from './TopMentions/TopMentions';

export default function Dashboard() {
	const { ready } = usePrivy();
	// Fetches the last activity for the user, and sends the request to sync the data
	useSetLastActive();

	if (!ready) {
		return null;
	}

	return (
		<div className='min-h-screen bg-neutral-100 pb-24'>
			<div className='max-w-7xl m-auto space-y-4 pt-6 md:pt-12'>
				<Overview />
				<div className='px-4 overflow-scroll md:overflow-auto lg:px-0 no-scrollbar'>
					<EngagementChartComponent />
				</div>
				<div className='flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 px-4 md:px-0'>
					<div className='w-full md:w-1/3 space-y-4'>
						<ImpactFollowers />
						<ImpactUnfollowers />
					</div>
					<div className='w-full md:w-2/3 space-y-4'>
						<TopCasts />
						<TopMentions />
					</div>
				</div>
			</div>
		</div>
	);
}

const EngagementChartComponent = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { duration } = useDuration();
	const { chartData, error: chartError } = useChartData(duration);

	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
			className={`flex flex-col ${isExpanded ? 'w-[1000px]' : 'w-[500px]'} md:w-full rounded-2xl m-auto bg-white/50 shadow-sm items-start justify-start`}
		>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, filter: isExpanded ? 'blur(0px)' : 'blur(0px)' }} className='w-full relative'>
				<AnimatePresence mode='wait'>
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						key={duration}
						className={`w-full ${isExpanded ? 'h-[500px]' : 'h-[400px]'} md:h-[500px]`}
					>
						<EngagementChart data={chartData} />
					</motion.div>
				</AnimatePresence>
			</motion.div>
			<button onClick={() => setIsExpanded(!isExpanded)} className=' text-neutral-400 px-4 py-4 md:hidden text-sm flex space-x-2 items-center'>
				<span>
					<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
						{isExpanded ? (
							<motion.path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='1.5'
								d='M14.75 18.25h2.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v.5m11.5.5-2.5 2.5m0 0h2.375m-2.375 0V8.875m-9 7.375v-2.5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-2.5a2 2 0 0 1-2-2Z'
							></motion.path>
						) : (
							<motion.path
								stroke='currentColor'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='1.5'
								d='M14.75 18.25h2.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v.5m9 3 2.5-2.5m0 0h-2.375m2.375 0v2.375M4.75 16.25v-2.5a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-2.5a2 2 0 0 1-2-2Z'
							></motion.path>
						)}
					</svg>
				</span>
				<span>
					Click for
					{isExpanded ? ' Contracted' : ' Expanded'} View
				</span>
			</button>
		</motion.div>
	);
};
