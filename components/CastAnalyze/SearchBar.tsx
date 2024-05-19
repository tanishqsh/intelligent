'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import LinkSVG from './SVG/LinkSVG';
import colors from '@/utils/colors';
import toast from 'react-hot-toast';
import toastStyles from '@/utils/toastStyles';

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
		<div className="flex rounded-md bg-neutral-50 shadow-sm">
			<div className="pl-4 flex w-full">
				<div className="pr-4 flex items-center">
					<Link target="_blank" href={castUrl}>
						<LinkSVG className={'w-4 h-4 ' + (isLoaded ? 'text-green-500' : 'text-gray-400')} />
					</Link>
				</div>
				<motion.input
					initial={{ opacity: 1, fontWeight: 500, color: '#000000' }}
					animate={{ opacity: isLoaded ? 1 : 0.7, fontWeight: 500, color: isLoaded ? '#12B981' : '#666666' }}
					whileFocus={{ opacity: 1, paddingRight: 10, fontWeight: 500, filter: 'brightness(1)', color: '#666666' }}
					className="px-3 py-2 focus:outline-none text-sm text-black w-full bg-neutral-50"
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
					color: colors.neutral[400],
				}}
				animate={{
					paddingRight: 0,
					paddingLeft: 20,
					paddingTop: 12,
					paddingBottom: 12,
					fontWeight: 500,
					color: isLoaded ? '#22C55E' : colors.neutral[400],
				}}
				whileHover={{
					paddingRight: 21,
					paddingLeft: 21,
					paddingTop: 12,
					paddingBottom: 12,
					opacity: 1,
					fontWeight: 500,
					color: isLoaded ? '#16A34A' : colors.neutral[600],
				}}
				whileTap={{ paddingRight: 21 }}
				transition={{ type: 'spring', stiffness: 100 }}
				className="text-sm rounded-e-md focus:outline-none flex items-center justify-center cursor-pointer group space-x-2"
				onClick={async () => {
					if (castUrl) {
						setIsLoading(true);
						try {
							await toast.promise(
								// @ts-ignore
								beginFetchCast(),
								{
									loading: 'Please wait, fetching cast',
									success: 'Successfully fetched cast',
									error: 'Failed to fetch cast, please try again later',
								},
								toastStyles.success
							);
						} catch (error) {
							console.error(error);
						} finally {
							setIsLoading(false);
						}
					} else {
						toast.error('Please enter a valid Warpcast URL');
					}
				}}
			>
				{isLoaded ? 'Refresh' : 'Analyze'}
				{isLoaded ? (
					<motion.svg
						whileHover={{ rotate: -15 }}
						whileTap={{ rotate: -45 }}
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-4 opacity-0 text-current transition-all group-hover:-rotate-15 duration-300 group-hover:opacity-85 translate-x-[-10px] group-hover:translate-x-0"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</motion.svg>
				) : (
					<span>
						<svg
							className="w-4 opacity-0 text-current transition-all duration-300 group-hover:opacity-85 translate-x-[-10px] group-hover:translate-x-0"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13.75 6.75L19.25 12L13.75 17.25"
							></path>
							<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H4.75"></path>
						</svg>
					</span>
				)}
			</motion.button>
		</div>
	);
}
