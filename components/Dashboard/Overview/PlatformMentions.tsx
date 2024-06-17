import { AnimatePresence, motion } from 'framer-motion';
import { useDuration } from '../DurationContext';
import EngagementChart2 from '../FollowersMiniChart';
import { useChartData } from '../hooks/useChartData';
import { useDashboardStats } from '../hooks/useDashboardStats';
import Duration from './Duration';

export default function PlatformMentions() {
	const { duration } = useDuration();
	const { chartData, error: chartError } = useChartData(duration);
	const { stats, error } = useDashboardStats();

	if (error) {
		// console.log(error);
	}

	if (!stats) {
		return null;
	}

	if (chartError) {
		console.log(chartError);
	}

	const getStatsByDuration = (duration: string) => {
		switch (duration) {
			case Duration.HOURS_24:
				return {
					mentions: stats.mentions_24h,
					prevMentions: stats.mentions_prev_24h,
					mentionsPercentageChange: stats.mentions_percentage_change_24h,
				};
			case Duration.DAYS_7:
				return {
					mentions: stats.mentions_7d,
					prevMentions: stats.mentions_prev_7d,
					mentionsPercentageChange: stats.mentions_percentage_change_7d,
				};
			case Duration.DAYS_30:
				return {
					mentions: stats.mentions_30d,
					prevMentions: stats.mentions_prev_30d,
					mentionsPercentageChange: stats.mentions_percentage_change_30d,
				};
			case Duration.DAYS_180:
				return {
					mentions: stats.mentions_180d,
					prevMentions: stats.mentions_prev_180d,
					mentionsPercentageChange: stats.mentions_percentage_change_180d,
				};
			default:
				return null;
		}
	};

	const statsByDuration = getStatsByDuration(duration);

	if (!statsByDuration) {
		return null;
	}

	const numberAnimationProps = {
		initial: { opacity: 0, y: -5 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 5 },
		transition: { type: 'spring', stiffness: 200, damping: 20 },
	};

	let isPercentageChangeNegative = parseFloat(statsByDuration.mentionsPercentageChange.replace('%', '')) < 0;

	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20 }}
			className="rounded-xl shadow-sm w-full overflow-hidden min-w-[250px]"
		>
			<div className="h-full items-center justify-between">
				<div className="flex flex-col justify-center p-3 md:p-6 bg-white relative">
					<h2 className="text-xs text-neutral-400">
						{' '}
						Mentions
						<span className="ml-2 rounded-full text-[8px] px-[5px] py-[3px] bg-neutral-100 text-neutral-400">{duration}</span>{' '}
					</h2>
					<AnimatePresence mode="wait">
						<motion.p key={statsByDuration.mentions + duration} {...numberAnimationProps} className="text-2xl mt-1 text-neutral-500">
							{new Intl.NumberFormat().format(statsByDuration.mentions)}
						</motion.p>
					</AnimatePresence>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						className={`flex space-x-1 items-center absolute right-4 top-4 rounded-full px-2 py-1 ${
							isPercentageChangeNegative ? 'bg-neutral-400/10 text-neutral-400' : 'bg-emerald-50/50 text-emerald-700'
						}`}
					>
						<motion.svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="size-4"
							transition={{ type: 'spring', stiffness: 200, damping: 20 }}
							animate={{ rotate: parseFloat(statsByDuration.mentionsPercentageChange.replace('%', '')) < 0 ? 180 : 0 }}
						>
							<path
								fillRule="evenodd"
								d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
								clipRule="evenodd"
							/>
						</motion.svg>
						<AnimatePresence mode="wait">
							<motion.span key={statsByDuration.mentions} {...numberAnimationProps} className="text-xs font-medium">
								{statsByDuration.mentionsPercentageChange}
							</motion.span>
						</AnimatePresence>
					</motion.div>
					<p className="text-xs mt-1 text-neutral-400">vs. {statsByDuration.prevMentions} in previous period </p>
				</div>
				<AnimatePresence mode="wait">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						key={duration}
						className="h-[80px] pt-3 flex items-center bg-neutral-100"
					>
						<EngagementChart2 data={chartData} />
					</motion.div>
				</AnimatePresence>
			</div>
		</motion.div>
	);
}
