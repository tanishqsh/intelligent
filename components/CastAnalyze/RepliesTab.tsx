'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PowerBadgeSVG from './SVG/PowerBadgeSVG';
import PopularSVG from './SVG/PopularSVG';
import dayjs from 'dayjs';
dayjs.extend(require('dayjs/plugin/relativeTime'));

export default function RepliesTab({ replies }: { replies: any[] }) {
	const repliesCount = replies.length;

	return (
		<div>
			<div className="text-neutral-400 text-xs bg-white py-3 rounded-t-md">
				<div className="text-xs py-1 px-3 border-neutral-100 capitalize flex items-center justify-between">
					<span className="font-medium text-neutral-600 text-xs font-inter">{repliesCount} Replies</span>
				</div>
			</div>
			<div className="space-y-0 flex flex-col max-h-[600px] overflow-scroll divide-y divide-dotted">
				{replies?.map((reply: any, i: number) => {
					const age = reply.castedAtTimestamp;
					const formattedAge = dayjs(age).fromNow();
					const replierDisplayName = reply?.castedBy?.profileDisplayName;
					const replierHandle = reply?.castedBy?.profileHandle;
					const pfp = reply.castedBy?.profileImage;
					const socialCapitalRank = reply?.castedBy?.socialCapital?.socialCapitalRank;
					const fid = reply?.fid;
					const isPowerUser = reply?.castedBy?.isFarcasterPowerUser;
					const text = reply?.text;

					return (
						<motion.div
							key={i}
							initial={{ opacity: 0, paddingTop: 8, paddingBottom: 8, y: 30 }}
							animate={{ opacity: 1, paddingTop: 10, paddingBottom: 10, y: 0 }}
							whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15 }}
							transition={{ type: 'spring', stiffness: 100 }}
							className="flex items-center space-x-3 bg-neutral-50 hover:bg-neutral-100 px-2"
						>
							<div className="flex justify-between w-full">
								<div className="">
									<div className="flex space-x-2 py-1">
										<div className="flex-shrink-0 pl-2">
											<Link target="_blank" href={`https://warpcast.com/${replierHandle}`}>
												<img className="w-10 border-4 border-neutral-100 h-10 rounded-full shadow-inner" src={pfp} alt="Profile" />
											</Link>
										</div>

										<div className="flex flex-col">
											<div className="flex space-x-1">
												<div className="font-medium whitespace-nowrap flex-shrink-0 text-sm text-neutral-600 opacity-75">
													{replierDisplayName}
												</div>
												<div>{isPowerUser && <PowerBadgeSVG className="w-4" />}</div>
												<div className="font-medium text-xs text-neutral-400 opacity-75">@{replierHandle}</div>
											</div>
											<div className="text-[15px] text-neutral-600 pt-[2px]">{text}</div>
											<div className="font-medium text-xs text-neutral-400 opacity-75 w-full pt-[2px]">{formattedAge}</div>
										</div>
									</div>
								</div>

								<div className="">
									<motion.button
										// onClick={() => copyAddress(recast?.user?.verifications?.[0])}
										initial={{ scale: 1 }}
										whileHover={{ scale: 1 }}
										whileTap={{ scale: 0.9 }}
										className="px-2"
									>
										<svg className="w-5 h-8 text-neutral-300 hover:text-neutral-400" fill="none" viewBox="0 0 24 24">
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
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
