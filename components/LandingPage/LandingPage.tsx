'use client';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
	const { ready, authenticated, login, logout, user } = usePrivy();

	const disableButton = !ready || (ready && authenticated);

	const router = useRouter();

	return (
		<div className="bg-[#F5F4FD] min-h-screen">
			<div className="px-12 py-12 m-auto" id="header">
				<motion.svg
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: 'spring', duration: 0.2, stiffness: 300 }}
					whileHover={{ scale: 1.2 }}
					width="36"
					height="36"
					viewBox="0 0 48 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="24" cy="24" r="24" fill="#FFAF34" />
				</motion.svg>
			</div>
			<div className="max-w-7xl m-auto">
				<div className="text-center">
					<motion.h1
						initial={{ lineHeight: '80px' }}
						className="text-7xl font-medium cursor-default"
						animate={{ lineHeight: '80px' }}
						whileHover={{ lineHeight: '90px' }}
					>
						<motion.span
							className="bg-yellow-400 inline-block rounded-md"
							initial={{ paddingRight: 0 }}
							animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}
							whileHover={{ paddingRight: 16, paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}
							transition={{ type: 'spring', duration: 0.7, stiffness: 250 }}
						>
							Intelligent
						</motion.span>
						ly engage and form <br /> deeper connections with your audience on{' '}
						<motion.span
							initial={{ paddingRight: 0 }}
							animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}
							whileHover={{ paddingRight: 16, paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}
							transition={{ type: 'spring', duration: 0.7, stiffness: 250 }}
							className="bg-[#8A63D2] text-white inline-block rounded-md"
						>
							Farcaster.
						</motion.span>
					</motion.h1>
					<div className="mt-12">{authenticated && <AccessDashboardButton />}</div>
					<div className="mt-8">
						{!authenticated && (
							<motion.button
								initial={{ paddingRight: 4, paddingLeft: 4, paddingTop: 2, paddingBottom: 2, opacity: 0.6, fontWeight: 200 }}
								animate={{ paddingRight: 14, paddingLeft: 14, paddingTop: 4, paddingBottom: 4, opacity: 0.6, fontWeight: 500 }}
								whileHover={{ paddingRight: 10, paddingLeft: 10, paddingTop: 4, paddingBottom: 4, opacity: 1, fontWeight: 400 }}
								transition={{ type: 'spring', duration: 0.1, stiffness: 200 }}
								className="text-2xl bg-yellow-400 px-2 py-2 rounded-md"
								disabled={disableButton}
								onClick={login}
							>
								{ready ? 'Login' : 'Loading'}
							</motion.button>
						)}
					</div>
					<div className="mt-24">
						<div className="max-w-5xl m-auto">
							<div className="w-full min-h-[500px] border-sm bg-[#E8E7F6] rounded-2xl"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const AccessDashboardButton = () => {
	const { ready, user, logout } = usePrivy();

	const router = useRouter();

	return (
		<motion.button
			initial={{ paddingRight: 4, paddingLeft: 4, paddingTop: 2, paddingBottom: 2, opacity: 0.6, fontWeight: 200 }}
			animate={{ paddingRight: 14, paddingLeft: 14, paddingTop: 5, paddingBottom: 5, opacity: 1, fontWeight: 500 }}
			whileHover={{ paddingRight: 13, paddingLeft: 13, paddingTop: 6, paddingBottom: 6, opacity: 0.9, fontWeight: 475 }}
			transition={{ type: 'spring', duration: 0.1, stiffness: 200 }}
			className="text-2xl bg-yellow-400 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-2 border-yellow-500"
			onClick={() => router.push('/dashboard')}
		>
			<img
				src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'}
				alt="Profile Picture"
				className="rounded-full w-12 border-2 border-yellow-500"
			></img>
			<span>Access Dashboard</span>
		</motion.button>
	);
};
