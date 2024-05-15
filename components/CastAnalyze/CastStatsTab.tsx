import { motion } from 'framer-motion';

const CastStatsTab = ({
	castStats,
}: {
	castStats: {
		icon: any;
		label: string;
		value: string;
		valueClassName: string;
	}[];
}) => {
	return (
		<motion.div
			initial={{ opacity: 1, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="shadow-sm bg-white font-inter rounded-md uppercase font-medium divide-y divide-dotted"
		>
			{castStats.map((stat: any, index: any) => (
				<motion.div
					initial={{ opacity: 0, y: 20, paddingTop: 10, paddingBottom: 10 }}
					animate={{ opacity: 1, y: 0, paddingTop: 10, paddingBottom: 10 }}
					whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
					transition={{ type: 'spring', stiffness: 100 }}
					key={index}
					className={`font-medium inline-flex text-xs w-full py-2 px-2 justify-between ${index === 0 && 'flex items-center rounded-t-md'}`}
				>
					<div className="flex items-center space-x-2">
						{stat.icon}
						<span className="font-semibold text-neutral-400 text-xs">{stat.label}</span>
					</div>
					<span className={stat.valueClassName}>{stat.value}</span>
				</motion.div>
			))}
		</motion.div>
	);
};

export default CastStatsTab;
