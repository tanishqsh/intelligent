'use client';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '../Header/Logo';
import toast from 'react-hot-toast';
import toastStyles from '@/utils/toastStyles';
import { logUser } from '@/lib/backend/logUser';
import FingerprintSVG from './SVG/FingerprintSVG';
import { useMediaQuery } from 'react-responsive';
import ExplainUI from '../ui/ExplainUI/ExplainUI';
import GetAccessButton from './GetAccessButton';

export default function LandingPage() {
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
	const { ready, authenticated, getAccessToken, logout, linkPasskey, user, unlinkPasskey } = usePrivy();
	const [isPasskeyLinked, setIsPasskeyLinked] = useState(false);
	const [passkeyAccount, setPasskeyAccount] = useState<any>(null);
	const router = useRouter();

	const { login } = useLogin({
		onComplete: async (user) => {
			const accessToken = await getAccessToken();
			if (!accessToken) return;
			await logUser(user, accessToken, toast, logout);
		},
		onError: (error) => {
			console.log(error);
			toast.error('Sign in not completed, please try again.', toastStyles.error);
		},
	});

	useEffect(() => {
		// get the linkedAccounts
		const linkedAccounts = user?.linkedAccounts || [];
		// retrieve account
		const passkeyAccount = linkedAccounts.find((account) => account.type === 'passkey');

		if (passkeyAccount) {
			setPasskeyAccount(passkeyAccount);
			setIsPasskeyLinked(true);
		} else {
			setIsPasskeyLinked(false);
		}
	}, [user]);

	const disableButton = !ready || (ready && authenticated);

	return (
		<div className='bg-neutral-100 min-h-screen font-general-sans'>
			<div className='px-4 md:px-12 py-4 md:py-8 m-auto flex justify-between items-center' id='header'>
				<Logo className='w-9 h-9 cursor-pointer' />
				{!authenticated && <GetAccessButton />}
			</div>
			<div className='max-w-7xl mt-12 m-auto px-4'>
				<div className='text-center'>
					<motion.h1
						className='md:text-7xl text-4xl font-medium cursor-default'
						initial={{ lineHeight: isMobile ? '' : '110px', opacity: 0, y: 20 }}
						animate={{ lineHeight: isMobile ? '' : '80px', opacity: 1, y: 0 }}
						whileHover={{ lineHeight: isMobile ? '' : '85px' }}
						transition={{ type: 'spring', stiffness: 250 }}
					>
						<motion.span
							className='bg-yellow-400 inline-block rounded-md'
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
						ly engage and form <br className='md:block hidden' /> deeper connections with your audience on <br className='md:hidden block' />
						<motion.img
							onClick={() => window.open('https://warpcast.com/~/channel/intelligent', '_blank')}
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
							src='/farcaster_icon.svg'
							className='w-12 md:w-24 inline-block border-4 rounded-xl md:border-8 md:rounded-3xl border-white drop-shadow-sm'
							alt='Farcaster Badge'
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
							className='text-black inline-block font-medium rounded-md'
						>
							Farcaster.
						</motion.span>
					</motion.h1>
					<div className='flex flex-col mt-12 space-y-4'>
						{authenticated && <AccessDashboardButton />}
						{authenticated && !isPasskeyLinked && <LinkPasskeyButton />}
						{authenticated && isPasskeyLinked && <UnlinkPasskeyButton id={passkeyAccount.credentialId} />}
					</div>
					<div className='mt-0'>
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
								className='text-2xl bg-yellow-400 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-2 border-yellow-500'
								disabled={disableButton}
								onClick={login}
							>
								{ready ? 'Login' : 'Loading'}
							</motion.button>
						)}
					</div>

					<div className='mt-12 m-auto bottom-10 absolute left-0 right-0'>
						<p className='font-medium font-inter text-2xl text-neutral-300'> Partner Dashboards </p>
						<motion.button
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ type: 'spring', stiffness: 250 }}
							onClick={() => router.push('/public/based-games')}
							className='inline-flex items-center justify-center space-x-2 mt-5 px-2 py-2 rounded-xl'
						>
							<img src='/fbi_emblem.svg' className='size-5' alt='FBI Emblem' />
							<span className='font-medium'>Based Games</span>
						</motion.button>
					</div>
				</div>
			</div>
		</div>
	);
}

const LinkPasskeyButton = () => {
	const { linkPasskey } = usePrivy();

	return (
		<ExplainUI text='(Optional) Connect a passkey for faster login'>
			<motion.button
				initial={{ paddingRight: 4, paddingLeft: 4, paddingTop: 2, paddingBottom: 2, opacity: 0.6, fontWeight: 500 }}
				animate={{ paddingRight: 13, paddingLeft: 13, paddingTop: 5, paddingBottom: 5, opacity: 1, fontWeight: 500 }}
				whileHover={{ paddingRight: 16, paddingLeft: 16, paddingTop: 5, paddingBottom: 5, opacity: 0.9, fontWeight: 475 }}
				whileTap={{ scale: 0.9 }}
				transition={{ type: 'spring', duration: 0.1, stiffness: 200 }}
				className='md:text-xl bg-neutral-200 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-0 border-yellow-400 w-full md:w-auto'
				onClick={linkPasskey}
			>
				<FingerprintSVG />
				<motion.span initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }}>
					Link Passkey
				</motion.span>
			</motion.button>
		</ExplainUI>
	);
};

const UnlinkPasskeyButton = ({ id }: { id: string }) => {
	const { unlinkPasskey } = usePrivy();

	return (
		<motion.button
			initial={{ paddingRight: 4, paddingLeft: 4, paddingTop: 2, paddingBottom: 2, opacity: 0.6, fontWeight: 500 }}
			animate={{ paddingRight: 13, paddingLeft: 13, paddingTop: 5, paddingBottom: 5, opacity: 1, fontWeight: 500 }}
			whileHover={{ paddingRight: 16, paddingLeft: 16, paddingTop: 5, paddingBottom: 5, opacity: 0.9, fontWeight: 475 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: 'spring', duration: 0.1, stiffness: 200 }}
			className='md:text-xl bg-neutral-200 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-0 border-yellow-400 w-full md:w-auto'
			onClick={() => unlinkPasskey(id)}
		>
			<FingerprintSVG />

			<motion.span initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }}>
				Unlink Passkey
			</motion.span>
		</motion.button>
	);
};

const AccessDashboardButton = () => {
	const { user } = usePrivy();
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
			className='md:text-2xl bg-yellow-400 px-2 py-2 rounded-md flex m-auto space-x-4 items-center justify-center border-0 border-yellow-500 w-full md:w-auto'
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
				alt='Profile Picture'
				className='rounded-full w-8 h-8 md:w-12 md:h-12 aspect-square border-2 border-yellow-500'
			></motion.img>
			<motion.span initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }}>
				Access Dashboard
			</motion.span>
		</motion.button>
	);
};
