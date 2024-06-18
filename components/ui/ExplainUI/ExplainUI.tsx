import * as Tooltip from '@radix-ui/react-tooltip';
import { AnimatePresence, motion } from 'framer-motion';

export default function ExplainUI({ children, text }: { children: React.ReactNode; text: React.ReactNode }) {
	return (
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div>{children}</div>
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content sideOffset={3}>
						<Tooltip.TooltipArrow
							style={{
								fill: 'rgba(0, 0, 0, 0.1)',
							}}
						/>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', stiffness: 100 }}
							className="text-[13px] bg-neutral-200 text-neutral-600 font-medium backdrop-blur-md antialiased px-2 py-1 rounded-md"
						>
							{text}
						</motion.div>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}
