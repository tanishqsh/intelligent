'use client';

import { usePrivy } from '@privy-io/react-auth';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import colors from '@/utils/colors';

const Header = () => {
	const router = useRouter();

	const { ready, authenticated, logout, user } = usePrivy();

	if (!ready) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Logo className="w-64 h-64" />
			</div>
		);
	}

	/**
	 *
	 */
	if (!authenticated) {
		router.replace('/');
		return null;
	}

	return (
		<header className="bg-neutral-100">
			<div className="px-6 py-4" id="surroundings">
				<div className="flex items-center justify-between">
					<motion.div
						initial={{ opacity: 0, scale: 0.3 }}
						animate={{ opacity: 1, scale: 0.9 }}
						transition={{
							type: 'spring',
							stiffness: 200,
						}}
					>
						<Link href="/">
							<Logo className="w-8 h-8" />
						</Link>
					</motion.div>
					<Menu />
					<div className="flex items-center justify-center space-x-4">
						{/* <div className="px-2 py-1 rounded-full bg-[#f1efff]/10 text-slate-400 shadow-inner text-xs font-medium">Subscribed</div> */}
						<div className="px-1 py-1 rounded-full bg-neutral-100 shadow-inner">
							<img src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'} alt="Profile Picture" className="rounded-full w-8 h-8"></img>
						</div>
						<div>
							<motion.button
								onClick={logout}
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 0.4, x: 0 }}
								whileHover={{ opacity: 0.8, x: 0 }}
								whileTap={{ scale: 0.9 }}
								className="font-medium cursor-pointer text-sm"
							>
								Sign out
							</motion.button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const Menu = () => {
	const pathname = usePathname();

	return (
		<div className="flex items-center justify-center space-x-8 antialiased">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0, color: pathname === '/dashboard' ? colors.neutral[800] : colors.neutral[400] }}
				whileHover={{ opacity: 1, color: colors.neutral[900] }}
				transition={{
					duration: 0.2,
				}}
			>
				<Link href="/dashboard">
					<span className="font-medium cursor-pointer text-sm">Dashboard</span>
				</Link>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0, color: pathname === '/dashboard/cast-analyze' ? colors.neutral[800] : colors.neutral[400] }}
				whileHover={{ opacity: 1, color: colors.neutral[900] }}
				transition={{
					duration: 0.2,
				}}
			>
				<Link href="/dashboard/cast-analyze">
					<span className="font-medium cursor-pointer text-sm">Analyze</span>
				</Link>
			</motion.div>
			{/* <motion.div
				initial={{ opacity: 0, y: 10 }}
				whileHover={{ opacity: 0.7, color: '#383838' }}
				animate={{ opacity: 1, y: 0, color: pathname === '/dashboard/search' ? '#383838' : '#8888AA' }}
				transition={{
					delay: 0.12,
					type: 'spring',
					stiffness: 200,
				}}
			>
				<span className="font-medium cursor-pointer text-sm">
					Search <sup className="text-[8px]"> Coming soon</sup>
				</span>
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileHover={{ opacity: 0.7, color: '#383838' }}
				animate={{ opacity: 1, y: 0, color: pathname === '/dashboard/ai' ? '#383838' : '#8888AA' }}
				transition={{
					delay: 0.14,
					type: 'spring',
					stiffness: 200,
				}}
			>
				<span className="font-medium cursor-pointer text-sm">
					AI Insights<sup className="text-[8px]"> Coming soon</sup>
				</span>
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileHover={{ opacity: 0.7, color: '#383838' }}
				animate={{ opacity: 1, y: 0, color: pathname === '/dashboard/ecosystem' ? '#383838' : '#8888AA' }}
				transition={{
					delay: 0.16,
					type: 'spring',
					stiffness: 200,
				}}
			>
				<span className="font-medium cursor-pointer text-sm">
					Ecosystem<sup className="text-[8px]"> Coming soon</sup>
				</span>
			</motion.div> */}
		</div>
	);
};

export default Header;
