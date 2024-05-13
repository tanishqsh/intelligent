'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LinkSVG from './LinkSVG';

export default function SearchBar({ castUrl, setCastUrl, fetchCast }: { castUrl: string; setCastUrl: (value: string) => void; fetchCast: () => void }) {
	return (
		<div className="flex rounded-md bg-white shadow-sm">
			<div className="pl-4 flex w-full">
				<div className="pr-4 flex items-center">
					<Link target="_blank" href={castUrl}>
						<LinkSVG />
					</Link>
				</div>
				<motion.input
					whileFocus={{ paddingRight: 10, fontWeight: 450, filter: 'brightness(1)' }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="px-3 py-2 focus:outline-none text-sm text-[#383838] focus:ring-opacity-50 w-full"
					type="text"
					value={castUrl}
					placeholder="Paste a Warpcast URL here and click Analyze"
					onChange={(e) => setCastUrl(e.target.value)}
				/>
			</div>
			<motion.button
				initial={{
					paddingRight: 4,
					paddingLeft: 4,
					paddingTop: 2,
					paddingBottom: 2,
					opacity: 0.6,
					fontWeight: 500,
					backgroundColor: '#ECEAFA',
				}}
				animate={{
					paddingRight: 20,
					paddingLeft: 20,
					paddingTop: 12,
					paddingBottom: 12,
					opacity: 1,
					fontWeight: 500,
					backgroundColor: '#FFAF34',
				}}
				whileHover={{
					paddingRight: 24,
					paddingLeft: 24,
					paddingTop: 12,
					paddingBottom: 12,
					opacity: 0.9,
					fontWeight: 525,
					backgroundColor: '#FFAF34',
				}}
				whileTap={{ scale: 0.9 }}
				transition={{ type: 'spring', duration: 0.1, stiffness: 200 }}
				className="text-sm rounded-e-lg"
				onClick={() => fetchCast()}
			>
				Analyze
			</motion.button>
		</div>
	);
}
