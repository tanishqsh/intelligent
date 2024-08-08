'use client';

import { useMediaQuery } from 'react-responsive';
import HighlightedText from '../ui/HighlightedText/HighlightedText';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const Apps = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
	const availableApps = [
		{
			id: 'hypersub',
			logo: '/hypersub_square.svg',
			name: 'Hypersub',
			description: 'Track your Hypersub performance in one place',
		},
		{
			id: 'paragraph',
			logo: 'https://d392zik6ho62y0.cloudfront.net/images/paragraph-logo.png',
			name: 'Paragraph',
			description: 'Track all your Paragraph subscribers in one place',
		},
		{
			id: 'alfafrens',
			logo: 'https://www.alfafrens.com/_next/image?url=%2Ficon-64.png&w=96&q=75',
			name: 'AlfaFrens',
			description: 'Import your AlfaFrens subscribers data to Intelligent',
		},
		{
			id: 'channel-pro',
			logo: '/intelligent.svg',
			name: 'Channel Pro',
			description: 'Detailed Channel Statistics and Analytics',
			color: '#33FF57',
		},
	];

	const installedApps = [
		{
			logo: '/intelligent.svg',
			name: 'Wallet Extractor',
			url: '/dashboard/cast-analyze',
			isURL: true,
			isInstalled: true,
			description: 'Create allowlists by easily extracting wallets from a cast',
			color: '#33FF57',
		},
		{
			logo: '/based_games.jpg',
			name: 'Based Games by FBI',
			url: '/dashboard/based-games',
			isURL: true,
			isInstalled: true,
			description: 'Only the based will survive. A team-based game of survival!',
			color: '#33FF57',
		},
	];

	return (
		<div className="min-h-screen bg-neutral-100 pb-24">
			<div className="max-w-7xl m-auto space-y-4 pt-6 md:pt-12">
				<div>
					<h2 className="text-sm text-neutral-400 font-medium">Upcoming apps</h2>
				</div>
				<div className="flex justify-start w-full flex-wrap">
					{availableApps.map((app, index) => {
						return (
							<motion.div
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ type: 'spring', stiffness: 250, delay: index * 0.1 }}
								key={index}
							>
								<AppCard app={app} />
							</motion.div>
						);
					})}
				</div>
				<div>
					<h2 className="text-sm text-neutral-400 font-medium">Available apps</h2>
				</div>
				<div className="flex justify-start w-full flex-wrap">
					{installedApps.map((app, index) => {
						return (
							<motion.div
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ type: 'spring', stiffness: 250, delay: index * 0.1 }}
								key={index}
							>
								<Link href={app?.url}>
									<AppCard installed app={app} />
								</Link>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

const AppCard = ({
	installed,
	app,
}: {
	installed?: boolean;
	app: {
		logo?: any;
		name: string;
		description: string;
		url?: string;
		isInstalled?: boolean;
	};
}) => {
	const [isHover, setIsHover] = useState(false);

	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 1)' }}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			transition={{ type: 'spring', stiffness: 250, damping: 10 }}
			className="bg-white/70 w-[300px] h-[210px] mb-4 mr-4 rounded-xl p-6 overflow-clip shadow-sm"
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<span>
						<img src={app.logo} className="w-6 h-6 rounded-md" />
					</span>
					<h3 className="font-medium text-xl text-black cursor-default"> {app.name} </h3>
					<p className="mt-2 text-neutral-400 text-base cursor-default"> {app.description} </p>
				</div>
				{!installed && (
					<motion.div
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						className="text-sm inline-flex items-center space-x-2 bg-black/5 rounded-2xl px-2 py-1 group-hover:h-[1000px] relative"
					>
						<motion.div
							className="text-black/30"
							initial={{ opacity: 1, y: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								type: 'spring',
								stiffness: 200,
								damping: 20,
								repeat: isHover ? Infinity : 0,
								repeatType: 'reverse',
							}}
						>
							Coming soon
							{/* <DownloadSVG /> */}
						</motion.div>
					</motion.div>
				)}
				{installed && (
					<motion.div
						transition={{ type: 'spring', stiffness: 200, damping: 20 }}
						animate={{ backgroundColor: isHover ? '#fbbf24' : '#f5f5f5' }}
						className="text-sm bg-neutral-100 inline-block px-2 py-1 rounded-2xl relative cursor-pointer"
					>
						Open
					</motion.div>
				)}
			</div>
		</motion.div>
	);
};

const DownloadSVG = () => {
	return (
		<svg className="size-5 absolute top-1 left-1 text-black/40" fill="none" viewBox="0 0 24 24">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 13.75L12 19.25L6.75 13.75"></path>
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18.25V4.75"></path>
		</svg>
	);
};

export default Apps;
