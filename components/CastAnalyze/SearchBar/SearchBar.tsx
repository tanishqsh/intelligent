'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LinkSVG from '../SVG/LinkSVG';
import SearchAction from './SearchAction';

export default function SearchBar({
	setIsLoading,
	isLoaded,
	castUrl,
	setCastUrl,
	beginFetchCast,
}: {
	setIsLoading: (value: boolean) => void;
	isLoaded: boolean;
	castUrl: string;
	setCastUrl: (value: string) => void;
	beginFetchCast: () => void;
}) {
	return (
		<div className="flex rounded-lg bg-neutral-50 shadow-sm">
			<div className="pl-4 flex w-full">
				<div className="pr-4 flex items-center">
					<Link target="_blank" href={castUrl}>
						<LinkSVG className={'w-4 h-4 ' + (isLoaded ? 'text-green-500' : 'text-gray-400')} />
					</Link>
				</div>
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					whileHover={{ paddingTop: 12, paddingBottom: 12, transition: { type: 'spring', stiffness: 100 } }}
					whileFocus={{ paddingTop: 12, paddingBottom: 12, transition: { type: 'spring', stiffness: 100 } }}
					className="w-full flex items-center justify-center cursor-text"
				>
					<motion.input
						initial={{ opacity: 1, fontWeight: 500, color: '#000000' }}
						animate={{ opacity: isLoaded ? 1 : 0.7, fontWeight: 400, color: isLoaded ? '#12B981' : '#666666' }}
						whileFocus={{ opacity: 1, paddingRight: 10, fontWeight: 450, filter: 'brightness(1)', color: '#999999' }}
						className="px-3 py-2 focus:outline-none text-sm text-black w-full bg-neutral-50 cursor-text"
						type="text"
						value={castUrl}
						placeholder="Paste a Cast URL here and click Analyze"
						onChange={(e) => setCastUrl(e.target.value)}
					/>
				</motion.div>
				<SearchAction setIsLoading={setIsLoading} castUrl={castUrl} isLoaded={isLoaded} beginFetchCast={beginFetchCast} />
			</div>
		</div>
	);
}
