'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LinkSVG from './LinkSVG';

export default function SearchBar({
	isLoaded,
	castUrl,
	setCastUrl,
	fetchCast,
}: {
	isLoaded: boolean;
	castUrl: string;
	setCastUrl: (value: string) => void;
	fetchCast: () => void;
}) {
	return (
		<div className="flex rounded-md bg-white shadow-sm">
			<div className="pl-4 flex w-full">
				<div className="pr-4 flex items-center">
					<Link target="_blank" href={castUrl}>
						<LinkSVG className={'w-4 h-4 ' + (isLoaded ? 'text-intelligent-yellow' : 'text-gray-400')} />
					</Link>
				</div>
				<motion.input
					initial={{ opacity: 1, fontWeight: 500, color: '#000000' }}
					animate={{ opacity: isLoaded ? 1 : 0.7, fontWeight: 500, color: isLoaded ? '#12B981' : '#666666' }}
					whileFocus={{ opacity: 1, paddingRight: 10, fontWeight: 500, filter: 'brightness(1)', color: '#666666' }}
					className="px-3 py-2 focus:outline-none text-sm text-black w-full"
					type="text"
					value={castUrl}
					placeholder="Paste a Warpcast URL here and click Analyze"
					onChange={(e) => setCastUrl(e.target.value)}
				/>
			</div>
			<motion.button
				initial={{
					paddingRight: 20,
					paddingLeft: 20,
					paddingTop: 12,
					paddingBottom: 12,
					fontWeight: 500,
				}}
				animate={{
					paddingRight: 0,
					paddingLeft: 20,
					paddingTop: 12,
					paddingBottom: 12,
					fontWeight: 500,
				}}
				whileHover={{
					paddingRight: 24,
					paddingLeft: 24,
					paddingTop: 12,
					paddingBottom: 12,
					opacity: 1,
					fontWeight: 525,
					filter: 'brightness(1.05)',
				}}
				whileTap={{ scale: 0.9 }}
				transition={{ type: 'spring', stiffness: 200 }}
				className="text-sm rounded-e-md bg-black/[0.03] text-black/50 font-medium focus:outline-none flex items-center justify-center cursor-pointer group space-x-2"
				onClick={() => fetchCast()}
			>
				<span>Analyze</span>
				<span>
					<svg
						className="w-4 opacity-0 transition-all duration-300 group-hover:opacity-85 translate-x-[-10px] group-hover:translate-x-0"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.75 6.75L19.25 12L13.75 17.25"></path>
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 12H4.75"></path>
					</svg>
				</span>
			</motion.button>
		</div>
	);
}
