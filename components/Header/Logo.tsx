import { AnimatePresence, motion } from 'framer-motion';

export default function Logo({ className }: { className?: string }) {
	return (
		<AnimatePresence>
			<motion.svg
				initial={{ opacity: 0, scale: 0.85 }}
				animate={{ opacity: 1, scale: 0.9 }}
				exit={{ opacity: 0, scale: 0.85 }}
				className={className}
				viewBox="0 0 48 48"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="24" cy="24" r="24" fill="#FFAF34" />
			</motion.svg>
		</AnimatePresence>
	);
}
