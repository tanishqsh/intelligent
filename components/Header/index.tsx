'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
	const router = useRouter();

	const { ready, authenticated, login, logout, user } = usePrivy();

	if (!ready) {
		return <div>Loading</div>;
	}

	/**
	 *
	 */
	if (!authenticated) {
		router.replace('/');
	}

	console.log('Users:', user);

	return (
		<header className="bg-primary-white">
			<div className="px-6 py-4" id="surroundings">
				<div className="flex justify-between items-center">
					<motion.div
						initial={{ opacity: 0, scale: 0.3 }}
						animate={{ opacity: 1, scale: 0.9 }}
						transition={{
							type: 'spring',
							stiffness: 260,
							damping: 20,
						}}
					>
						<Link href="/">
							<Logo className="w-8 h-8" />
						</Link>
					</motion.div>

					<div className="space-x-4">
						<button onClick={() => router.replace('/dashboard')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
							Dashboard
						</button>
						<button
							onClick={() => router.replace('/dashboard/casts')}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Casts
						</button>
						<button
							onClick={() => router.replace('/dashboard/cast-analyze')}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Engagement Tools
						</button>
					</div>
					<div className="flex items-center justify-center space-x-4">
						<div className="px-1 py-1 rounded-full bg-[#f1efff] shadow-inner">
							<img src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'} alt="Profile Picture" className="rounded-full w-8"></img>
						</div>
						{/* <div>
							<motion.button
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 0.4, x: 0 }}
								whileHover={{ opacity: 0.8, x: 0 }}
								whileTap={{ scale: 0.9 }}
								className="font-medium cursor-pointer text-sm"
							>
								Sign out
							</motion.button>
						</div> */}
					</div>
				</div>
			</div>
		</header>
	);
}
