import { motion } from 'framer-motion';

const CastActions = ({
	useDegenTipsFiltering,
	setUseDegenTipsFiltering,
	useAlfaFrensFiltering,
	setUseAlfaFrensFiltering,
}: {
	useDegenTipsFiltering: boolean;
	setUseDegenTipsFiltering: (value: boolean) => void;
	useAlfaFrensFiltering: boolean;
	setUseAlfaFrensFiltering: (value: boolean) => void;
}) => {
	return (
		<div>
			<motion.div
				initial={{ opacity: 1, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', stiffness: 100 }}
				className="shadow-sm bg-white font-inter rounded-md uppercase font-medium divide-y divide-dotted"
			>
				<div className={`font-medium inline-flex text-xs w-full py-2 px-2 justify-between items-center rounded-t-md`}>
					<div className="flex items-center space-x-2">
						<img className="w-4" src="/alfa.png" />
						<span className="font-semibold text-neutral-400 text-xs">Filter AlfaFrens Subscibers</span>
					</div>
					<input
						onChange={(e) => setUseAlfaFrensFiltering(e.target.checked)}
						type="checkbox"
						checked={useAlfaFrensFiltering}
						className="h-4 w-4 text-purple-600"
					/>
				</div>
				<div className={`font-medium inline-flex text-xs w-full py-2 px-2 justify-between items-center rounded-t-md`}>
					<div className="flex items-center space-x-2">
						<span>
							<img className="w-[12px] opacity-50 " src="/degen.svg" />
						</span>
						<span className="font-semibold text-neutral-400 text-xs">Filter Degen Tips</span>
					</div>
					<input
						onChange={(e) => setUseDegenTipsFiltering(e.target.checked)}
						type="checkbox"
						checked={useDegenTipsFiltering}
						className="h-4 w-4 text-purple-600"
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default CastActions;
