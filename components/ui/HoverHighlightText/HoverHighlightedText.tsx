import { motion } from 'framer-motion';

const HoverHighlightedText = ({ children }: { children: React.ReactNode }) => {
	return (
		<motion.span
			className=" inline-block rounded-md"
			initial={{ paddingRight: 0, backgroundColor: '#F5F5F5' }}
			animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4, backgroundColor: '#F5F5F5' }}
			whileHover={{
				paddingRight: 16,
				paddingLeft: 16,
				paddingTop: 4,
				paddingBottom: 4,
				fontWeight: 550,
				backgroundColor: '#FFD700',
			}}
			transition={{ type: 'spring', stiffness: 250 }}
		>
			{children}
		</motion.span>
	);
};

export default HoverHighlightedText;
