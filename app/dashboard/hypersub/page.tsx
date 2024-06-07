'use client';

import { motion } from 'framer-motion';
// json import
import sampleObj from './sample.json';
import subscribers from './sample2.json';
import PowerBadgeSVG from '@/components/CastAnalyze/SVG/PowerBadgeSVG';
import Link from 'next/link';
import toast from 'react-hot-toast';
import toastStyles from '@/utils/toastStyles';
import ComingSoon from '@/components/Dashboard/ComingSoon/ComingSoon';

const subscriptionsData = getSubscriptionsData(sampleObj);

export default function Hypersub() {
	const membership = subscriptionsData['0xd899404e3a2272862d87b2bf68426e1b5ec77dda'];
	let subs = subscribers.subscribers;

	return <ComingSoon />;

	return (
		<div>
			<div className="h-screen bg-neutral-100 pb-24">
				<div className="max-w-2xl m-auto space-y-4 pt-12">
					<div className="flex items-center space-x-4">
						<img src={membership?.metadata?.art_url} alt="Membership" className="w-[50px] rounded-md shadow-sm" />
						<div className="flex items-center space-x-4">
							<h3 className="text-4xl font-general-sans font-medium text-neutral-700">{membership?.metadata?.title}</h3>
						</div>
					</div>
					<hr />
					<h3 className="text-neutral-400 text-sm">Active Subscribers </h3>
					{
						//
						subs.map((sub: any, i: number) => {
							let isPowerUser = sub?.user?.power_badge;
							let profileImage = sub?.user?.pfp_url;
							let profileHandle = sub?.user?.username;
							let profileDisplayName = sub?.user?.display_name;

							let connectedETHAddress = sub?.user?.verifications[0];

							const noWalletConnected = () => {
								toast.error('No wallet connected', toastStyles.error);
							};

							const copyETHAddress = () => {
								navigator.clipboard.writeText(connectedETHAddress);
								toast.success(
									`${profileDisplayName}'s ethereum address (${connectedETHAddress.slice(0, 4)}...${connectedETHAddress.slice(
										-4
									)}) copied to clipboard`,
									toastStyles.success
								);
							};

							return (
								<div key={i} className="space-y-0 flex flex-col max-h-[200px] overflow-scroll divide-y divide-dotted">
									<motion.div
										initial={{ opacity: 0, paddingTop: 8, paddingBottom: 8, y: 30 }}
										animate={{ opacity: 1, paddingTop: 10, paddingBottom: 10, y: 0 }}
										whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
										transition={{ type: 'spring', stiffness: 100 }}
										className="flex items-center w-full space-x-3 bg-neutral-50 hover:bg-neutral-100 px-2"
									>
										<div className="flex-shrink-0 pl-2">
											<Link target="_blank" href={`https://warpcast.com/${sub?.user?.username}`}>
												<img
													className="w-10 border-4 border-neutral-100 h-10 rounded-full shadow-inner"
													src={profileImage}
													alt="Profile"
												/>
											</Link>
										</div>

										<div className="flex flex-col items-start justify-start w-full">
											<div className="font-medium w-full text-base text-neutral-600 flex items-center">
												{profileDisplayName} <div>{isPowerUser && <PowerBadgeSVG className="w-4" />}</div>
											</div>
											<div className="font-medium text-xs text-neutral-400">@{profileHandle}</div>
										</div>
										<div className="flex justify-end pr-2 space-x-4">
											<motion.button
												onClick={() => (connectedETHAddress ? copyETHAddress() : noWalletConnected())}
												initial={{ scale: 1 }}
												whileHover={{ scale: 1 }}
												whileTap={{ scale: 0.9 }}
												className="px-2"
											>
												<svg
													className={`w-5 h-8 ${connectedETHAddress ? 'text-neutral-300 hover:text-neutral-400' : 'text-rose-600'}`}
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
											<motion.button>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={2}
													stroke="currentColor"
													className="size-4 text-neutral-300 hover:text-neutral-400"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
													/>
												</svg>
											</motion.button>
										</div>
									</motion.div>
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	);
}

function getSubscriptionsData(subscriptions: any) {
	return subscriptions.subscriptions_created.reduce((acc: any, subscription: any) => {
		acc[subscription.contract_address] = subscription;
		return acc;
	}, {});
}
