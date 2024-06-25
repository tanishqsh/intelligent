'use client';

import { usePrivy } from '@privy-io/react-auth';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import Link from 'next/link';
import { motion } from 'framer-motion';
import colors from '@/utils/colors';
import HoverHighlightedText from '../ui/HoverHighlightText/HoverHighlightedText';
import DegenAllowance from './DegenAllowance/DegenAllowance';
import ExplainUI from '../ui/ExplainUI/ExplainUI';

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
			<div className="py-4" id="surroundings">
				<div className="flex items-center justify-between max-w-7xl m-auto">
					<div>
						<motion.div
							className="md:w-1/3"
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
					</div>

					<div className="flex items-center justify-end space-x-4 md:w-1/3">
						<div className="md:block hidden">
							<ExplainUI text={'Daily $DEGEN allowance'}>
								<DegenAllowance />
							</ExplainUI>
						</div>

						<div className="px-1 py-1 rounded-full bg-neutral-100 shadow-inner">
							<img src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'} alt="Profile Picture" className="rounded-full w-8 h-8"></img>
						</div>
						<div className="md:block hidden">
							<motion.button
								onClick={logout}
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 0.4, x: 0 }}
								whileHover={{ opacity: 0.8, x: 0 }}
								whileTap={{ scale: 0.9 }}
								className="font-medium cursor-pointer text-xs"
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

export default Header;
