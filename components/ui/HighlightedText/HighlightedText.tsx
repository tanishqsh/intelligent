import { motion } from 'framer-motion';

const HighlightedText = ({ children }: { children: React.ReactNode }) => {
	return (
		<motion.span
			className="bg-yellow-400 inline-block rounded-md"
			initial={{ paddingRight: 0 }}
			animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}
			whileHover={{
				paddingRight: 16,
				paddingLeft: 16,
				paddingTop: 4,
				paddingBottom: 4,
				fontWeight: 550,
			}}
			transition={{ type: 'spring', stiffness: 250 }}
		>
			{children}
		</motion.span>
	);
};

export default HighlightedText;
