'use client';

import colors from '@/utils/colors';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
	const { ready, authenticated, login, logout, user } = usePrivy();

	if (!ready) {
		return null;
	}

	return (
		<div className="h-screen bg-neutral-100 flex items-center justify-center">
			<div className="space-y-8 mt-[-200px]">
				<div className="space-y-2 h-[100px] overflow-hidden">
					{[...Array(10)].map((_, index) => (
						<motion.div
							key={index}
							initial={{ width: '200px', height: '20px', translateY: '40px', background: colors.neutral[100] }}
							animate={{ width: '200px', height: '20px', translateY: '-40px', background: colors.neutral[200] }}
							transition={{
								duration: 5,
								repeat: Infinity,
								repeatType: 'reverse',
								backgroundTransition: { delay: 2.5 },
							}}
							className="h-[20px] w-[200px] rounded-full m-auto"
						></motion.div>
					))}
				</div>
				<p className="text-neutral-400 max-w-sm text-center">
					We are working on releasing the dashboard. Stay updated,{' '}
					<Link href="https://warpcast.com/~/channel/intelligent">
						<span className="text-amber-600">/intelligent </span>
					</Link>{' '}
				</p>
			</div>
		</div>
	);
}
