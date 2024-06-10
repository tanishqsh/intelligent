'use client';

import { usePrivy } from '@privy-io/react-auth';
import EngagementChart from './EngagementChart';
import useUserStatisticsData from './hooks/useUserStatisticsData';
import { useChartData } from './hooks/useChartData';
import Overview from './Overview/Overview';
import { useDuration } from './DurationContext';
import { AnimatePresence, motion } from 'framer-motion';
import TopCasts from './TopCasts/TopCasts';
import ImpactFollowers from './ImpactFollowers/ImpactFollowers';
import { useSetLastActive } from './hooks/useSetLastActive';

export default function Dashboard() {
	const { duration } = useDuration();
	const { ready, user } = usePrivy();
	const { userStatistics, error: userStatsError } = useUserStatisticsData(user?.farcaster?.fid?.toString() || '', ready);

	const { data: userSync } = useSetLastActive();

	console.log(userSync);

	const { chartData, error: chartError } = useChartData(duration);

	const fid = user?.farcaster?.fid?.toString() || '';

	if (!ready) {
		return <div>Loading</div>;
	}

	return (
		<div className="min-h-screen bg-neutral-100 pb-24">
			<div className="max-w-7xl m-auto space-y-4 pt-12">
				<Overview />
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col rounded-2xl m-auto bg-white/50 shadow-sm items-start justify-start"
				>
					<AnimatePresence mode="wait">
						<motion.div
							initial={{ y: 10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 10, opacity: 0 }}
							transition={{ type: 'spring', stiffness: 200, damping: 20 }}
							key={duration}
							className="h-[500px] w-full overflow-hidden"
						>
							<EngagementChart data={chartData} />
						</motion.div>
					</AnimatePresence>
				</motion.div>
				<div className="flex justify-between space-x-4">
					<div className="w-2/3">
						<TopCasts />
					</div>
					<div className="w-1/3">
						<ImpactFollowers />
					</div>
				</div>
				{/* <div className="flex justify-between">
					<div className="bg-white p-10 text-neutral-400">Top Mentions</div>
					<div className="bg-white p-10 text-neutral-400">Top 10 most engaged people with you in last [duration] </div>
				</div>
				<div className="flex justify-between">
					<div className="bg-white p-10 text-neutral-400">Impactful Followers - top 10 followers in last [duration] with over 10K followers</div>
					<div className="bg-white p-10 text-neutral-400">Impactful Unfollowers - top 10 unfollowers in last [duration] with over 10K followers</div>
				</div> */}
			</div>
		</div>
	);
}
