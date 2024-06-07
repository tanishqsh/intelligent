import HighlightedText from '@/components/ui/HighlightedText/HighlightedText';
import colors from '@/utils/colors';
import { motion } from 'framer-motion';

const ComingSoon = () => {
	return (
		<div className="h-screen bg-neutral-100 flex items-center justify-center">
			<div className="space-y-8 mt-[-200px]">
				<div className="space-y-2 h-[100px] overflow-hidden">
					{[...Array(10)].map((_, index) => (
						<motion.div
							key={index}
							initial={{ width: '200px', height: '20px', translateY: '40px', background: colors.neutral[100] }}
							animate={{ width: '200px', height: '20px', translateY: '-40px', background: colors.neutral[200] }}
							transition={{
								duration: 5,
								repeat: Infinity,
								delay: index * 0.5,
								backgroundTransition: { delay: 2.5 },
							}}
							className="h-[20px] w-[200px] rounded-full m-auto"
						></motion.div>
					))}
				</div>
				<motion.p
					initial={{ opacity: 0, translateY: 20 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: 'spring', stiffness: 100 }}
					className="text-black max-w-lg text-center leading-tight font-general-sans font-medium text-4xl"
				>
					Your <br /> <HighlightedText> hypersub dashboard </HighlightedText> <br /> will be here soon.
				</motion.p>
			</div>
		</div>
	);
};

export default ComingSoon;
