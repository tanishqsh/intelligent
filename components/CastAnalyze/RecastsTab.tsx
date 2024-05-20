import colors from '@/utils/colors';
import toastStyles from '@/utils/toastStyles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PowerBadgeSVG from './SVG/PowerBadgeSVG';

const RecastsTab = ({ recasts, copyAllAddresses }: { recasts: any; copyAllAddresses: () => void }) => {
	const copyAddress = (address: string) => {
		navigator.clipboard.writeText(address);
		console.log('Copied address:', address);
		toast.success('Copied address', {
			style: {
				background: colors.neutral[50],
				color: colors.neutral[600],
				borderRadius: '6px',
				fontSize: '0.8rem',
			},
			iconTheme: {
				primary: colors.neutral[100],
				secondary: colors.neutral[600],
			},
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="bg-white rounded-md shadow-sm"
		>
			<div className="text-xs py-2 px-3 border-b border-neutral-100 capitalize flex items-center justify-between">
				<span className="px-1 font-medium text-neutral-600 text-xs font-inter">{recasts?.length} Recasts</span>
				<motion.button
					onClick={copyAllAddresses}
					initial={{ scale: 1 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.9 }}
					transition={{ type: 'spring', stiffness: 100 }}
					className="flex space-x-1 items-center font-medium px-2 py-1 rounded-md text-neutral-600"
				>
					<svg className="w-5" fill="none" viewBox="0 0 24 24">
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
							d="M6.5 15.25V15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H13.5C14.4665 4.75 15.25 5.5335 15.25 6.5V6.5"
						></path>
						<rect
							width="10.5"
							height="10.5"
							x="8.75"
							y="8.75"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
							rx="2"
						></rect>
					</svg>
					<span>Copy All</span>
				</motion.button>
			</div>
			<div className="space-y-0 flex flex-col max-h-[400px] overflow-scroll divide-y divide-dotted">
				{recasts?.map((recast: any, i: number) => {
					let profileHandle = recast?.reactedBy?.profileHandle;
					let profileImage = recast?.reactedBy?.profileImage;
					let profileDisplayName = recast?.reactedBy?.profileDisplayName;
					let isPowerUser = recast?.reactedBy?.isFarcasterPowerUser;

					let connectedWalletAddress =
						recast?.reactedBy?.connectedAddresses && recast.reactedBy.connectedAddresses.length > 0
							? recast.reactedBy.connectedAddresses[0].address
							: null;

					const copyAddress = () => {
						navigator.clipboard.writeText(connectedWalletAddress);
						toast.success(
							`${profileDisplayName}'s address (****${connectedWalletAddress.slice(0, 4)}...${connectedWalletAddress.slice(
								-4
							)}) copied to clipboard`,
							toastStyles.success
						);
					};

					const noWalletConnected = () => {
						toast.error(`${profileDisplayName} has not connected a wallet`, toastStyles.error);
					};

					return (
						<motion.div
							key={i}
							initial={{ opacity: 0, paddingTop: 8, paddingBottom: 8, y: 30 }}
							animate={{ opacity: 1, paddingTop: 10, paddingBottom: 10, y: 0 }}
							whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
							transition={{ type: 'spring', stiffness: 100 }}
							className="flex items-center space-x-3 bg-neutral-50 hover:bg-neutral-100 px-2"
						>
							<div className="flex-shrink-0 pl-2">
								<Link target="_blank" href={`https://warpcast.com/${profileHandle}`}>
									<img className="w-10 border-4 border-neutral-100 h-10 rounded-full shadow-inner" src={profileImage} alt="Profile" />
								</Link>
							</div>

							<div className="flex flex-col items-start justify-start w-full">
								<div className="font-medium w-full text-base text-neutral-600 flex items-center">
									{profileDisplayName} <div>{isPowerUser && <PowerBadgeSVG className="w-4" />}</div>
								</div>
								<div className="font-medium text-xs text-neutral-400">@{profileHandle}</div>
							</div>
							<div className="flex justify-end pr-2">
								<motion.button
									onClick={() => (connectedWalletAddress ? copyAddress() : noWalletConnected())}
									initial={{ scale: 1 }}
									whileHover={{ scale: 1 }}
									whileTap={{ scale: 0.9 }}
									className="px-2"
								>
									<svg
										className={`w-5 h-8 ${connectedWalletAddress ? 'text-neutral-300 hover:text-neutral-400' : 'text-rose-600'}`}
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.5"
											d="M19.25 8.25V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75"
										></path>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.5 13C16.5 13.2761 16.2761 13.5 16 13.5C15.7239 13.5 15.5 13.2761 15.5 13C15.5 12.7239 15.7239 12.5 16 12.5C16.2761 12.5 16.5 12.7239 16.5 13Z"
										></path>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="1.5"
											d="M17.25 8.25H6.5C5.5335 8.25 4.75 7.4665 4.75 6.5C4.75 5.5335 5.5335 4.75 6.5 4.75H15.25C16.3546 4.75 17.25 5.64543 17.25 6.75V8.25ZM17.25 8.25H19.25"
										></path>
									</svg>
								</motion.button>
							</div>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
};

export default RecastsTab;
