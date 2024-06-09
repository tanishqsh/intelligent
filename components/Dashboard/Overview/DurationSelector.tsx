import colors from '@/utils/colors';
import { motion } from 'framer-motion';
import Duration from './Duration';
import { useDuration } from '../DurationContext';

const intervals = [Duration.HOURS_24, Duration.DAYS_7, Duration.DAYS_30, Duration.DAYS_180];

const DurationSelector = ({ placement = '' }: { placement?: string }) => {
	const { duration, setDuration } = useDuration();

	return (
		<div className="flex relative">
			{intervals.map((interval, index) => (
				<div
					key={index}
					className={`relative px-2 py-1 rounded-sm cursor-pointer ${interval === duration ? 'z-0' : ''}`}
					onClick={() => setDuration(interval)}
				>
					<motion.p
						className={`text-xs`}
						animate={{ color: duration === interval ? colors.neutral[500] : colors.neutral[300] }}
						whileHover={{ color: colors.neutral[400] }}
					>
						{interval}
					</motion.p>
					{duration === interval && (
						<motion.div
							className="absolute inset-0 bg-intelligent-yellow/30 rounded-lg"
							layoutId={'durationSelector' + placement}
							initial={false}
							transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default DurationSelector;
