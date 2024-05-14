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
						<LinkSVG className={'w-4 h-4 ' + (isLoaded ? 'text-green-500' : 'text-gray-500')} />
					</Link>
				</div>
				<motion.input
					initial={{ opacity: 1, fontWeight: 500, color: '#000000' }}
					animate={{ opacity: isLoaded ? 1 : 0.7, fontWeight: 500, color: isLoaded ? '#12B981' : '#666666' }}
					whileFocus={{ opacity: 1, paddingRight: 10, fontWeight: 550, filter: 'brightness(1)', color: '#666666' }}
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
					paddingRight: 20,
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
				className="text-sm rounded-e-md bg-zinc-100 text-black font-medium focus:outline-none"
				onClick={() => fetchCast()}
			>
				Analyze
			</motion.button>
		</div>
	);
}
