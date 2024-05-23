'use client';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Logo from '../Header/Logo';
import toast from 'react-hot-toast';
import toastStyles from '@/utils/toastStyles';
import { logUser } from '@/lib/backend/logUser';

export default function LandingPage() {
	const { ready, authenticated, getAccessToken, logout } = usePrivy();

	const { login } = useLogin({
		onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
			const accessToken = await getAccessToken();
			if (!accessToken) return;
			await logUser(user, accessToken, toast, logout);
		},
		onError: (error) => {
			console.log(error);
			toast.error('Sign in not completed, please try again.', toastStyles.error);
		},
	});

	const disableButton = !ready || (ready && authenticated);

	return (
		<div className="bg-neutral-100 min-h-screen font-general-sans">
			<div className="px-12 py-8 m-auto" id="header">
				<Logo className="w-9 h-9 cursor-pointer" />
			</div>
			<div className="max-w-7xl mt-12 m-auto">
				<div className="text-center">
					<motion.h1
						className="text-7xl font-medium cursor-default"
						initial={{ lineHeight: '110px', opacity: 0, y: 20 }}
						animate={{ lineHeight: '80px', opacity: 1, y: 0 }}
						whileHover={{ lineHeight: '85px' }}
						transition={{ type: 'spring', stiffness: 250 }}
					>
						<motion.span
							className="bg-yellow-400 inline-block rounded-md"
							initial={{ paddingRight: 0 }}
							animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}
							whileHover={{
								paddingRight: 16,
								paddingLeft: 16,
								paddingTop: 4,
								paddingBottom: 4,
								fontWeight: 550,
							}}
							transition={{ type: 'spring', stiffness: 250 }}
						>
							Intelligent
						</motion.span>
						ly engage and form <br /> deeper connections with your audience on{' '}
						<motion.img
							initial={{ scale: 0.2, opacity: 0 }}
							drag
							whileTap={{
								scale: 0.4,
							}}
							dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
							animate={{
								scale: 0.8,
								opacity: 1,
								rotate: -10,
								transition: {
									// delay: 0.5,
									type: 'spring',
									stiffness: 150,
								},
							}}
							whileInView={{
								scale: 0.8,
								opacity: 1,
								rotate: -10,
								transition: {
									delay: 0.5,
									type: 'spring',
									stiffness: 150,
								},
							}}
							whileHover={{ scale: 0.8, rotate: -6 }}
							src="/farcaster_icon.svg"
							className="w-24 inline-block border-8 rounded-3xl border-white drop-shadow-sm"
							alt="Farcaster Badge"
						/>
						<motion.span
							initial={{ paddingRight: 0 }}
							animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}
							whileHover={{
								paddingRight: 16,
								paddingLeft: 16,
								paddingTop: 4,
								paddingBottom: 4,
								fontWeight: 550,
							}}
							transition={{ type: 'spring', stiffness: 200 }}
							className="text-black inline-block font-medium rounded-md"
						>
							Farcaster.
						</motion.span>
					</motion.h1>
					<div className="mt-12">{authenticated && <AccessDashboardButton />}</div>
					<div className="mt-8">
						{!authenticated && (
							<motion.button
								initial={{
									y: 20,
									paddingRight: 13,
									paddingLeft: 13,
									paddingTop: 5,
									paddingBottom: 5,
									opacity: 0,
									fontWeight: 500,
								}}
								animate={{ y: 0, paddingRight: 13, paddingLeft: 13, paddingTop: 5, paddingBottom: 5, opacity: 1, fontWeight: 500 }}
								whileHover={{ paddingRight: 16, paddingLeft: 16, paddingTop: 5, paddingBottom: 5, opacity: 0.9, fontWeight: 475 }}
								whileTap={{ scale: 0.9 }}
								transition={{ type: 'spring', stiffness: 250 }}
								className="text-2xl bg-yellow-400 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-2 border-yellow-500"
								disabled={disableButton}
								onClick={login}
							>
								{ready ? 'Login' : 'Loading'}
							</motion.button>
						)}
					</div>
					{/* <div className="mt-24">
						<div className="max-w-7xl m-auto">
							<motion.div
								initial={{ opacity: 0, y: 200 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ type: 'spring', stiffness: 50 }}
								className="w-full min-h-[500px] border-sm bg-[#E8E7F6] rounded-2xl"
							></motion.div>
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
}

const AccessDashboardButton = () => {
	const { ready, user, logout } = usePrivy();

	const [inTap, setInTap] = useState(false);

	const router = useRouter();

	return (
		<motion.button
			initial={{ paddingRight: 4, paddingLeft: 4, paddingTop: 2, paddingBottom: 2, opacity: 0.6, fontWeight: 500 }}
			animate={{ paddingRight: 13, paddingLeft: 13, paddingTop: 5, paddingBottom: 5, opacity: 1, fontWeight: 500 }}
			whileHover={{ paddingRight: 16, paddingLeft: 16, paddingTop: 5, paddingBottom: 5, opacity: 0.9, fontWeight: 475 }}
			whileTap={{ scale: 0.9 }}
			onHoverStart={() => setInTap(true)}
			onHoverEnd={() => setInTap(false)}
			transition={{ type: 'spring', duration: 0.1, stiffness: 200 }}
			className="text-2xl bg-yellow-400 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-0 border-yellow-500"
			onClick={() => router.push('/dashboard')}
		>
			<motion.img
				initial={{ scale: 0.2, opacity: 0 }}
				animate={{
					scale: inTap ? 1.05 : 1,
					opacity: 1,
					transition: {
						type: 'spring',
						stiffness: 150,
					},
				}}
				src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'}
				alt="Profile Picture"
				className="rounded-full w-12 h-12 aspect-square border-2 border-yellow-500"
			></motion.img>
			<motion.span initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }}>
				Access Dashboard
			</motion.span>
		</motion.button>
	);
};
