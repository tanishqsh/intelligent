import colors from '@/utils/colors';
import ReactLinkify from 'react-linkify';
import { AnimatePresence, motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';
import QuoteCastFlair from './Flairs/QuoteCastFlair';
import MostEngagedFlair from './Flairs/MostEngagedFlair';
import TimeFlair from './Flairs/TimeFlair';
import ReplyFlair from './Flairs/ReplyFlair';
import EngagementFlair from './Flairs/EngagementFlair';
import EmbedPreview from './EmbedPreview/EmbedPreview';
import Link from 'next/link';
import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';
import ChannelFlair from './Flairs/ChannelFlair';

const TopCastPreview = ({ cast, i, pfp }: { cast: any; i: any; pfp: any }) => {
	let parent_cast_fid = cast?.parent_cast_fid;
	let parent_cast_hash = cast?.parent_cast_hash;
	let parent_cast_url = cast?.parent_cast_url;
	let text = cast?.text;
	let engagement_count = cast?.engagement_count;
	let hash = cast?.cast_hash;
	let time = cast?.cast_time;
	let embeds = cast?.embeds;

	let url = cast?.meta?.url || '#';
	let channelName = cast?.meta?.channel?.name;
	let channelId = cast?.meta?.channel?.channelId;
	let imageURL = cast?.meta?.channel?.imageUrl;
	let channelURL = 'https://warpcast.com/~/channel/' + channelId;

	console.log('cast ', cast);

	let isQuoteCast = embeds?.some((embed: any) => embed?.castId);

	let quote_profileImage = (isQuoteCast && cast?.meta?.quotedCast[0]?.castedBy?.profileImage) || '';
	let quote_profileHandle = isQuoteCast ? cast?.meta?.quotedCast[0]?.castedBy?.profileHandle : '';
	let quote_profileDisplayName = isQuoteCast ? cast?.meta?.quotedCast[0]?.castedBy?.profileDisplayName : '';
	let quote_isPowerUser = isQuoteCast ? cast?.meta?.quotedCast[0]?.castedBy?.isFarcasterPowerUser : '';
	let quote_text = isQuoteCast ? cast?.meta?.quotedCast[0]?.text : '';
	let quote_url = isQuoteCast ? cast?.meta?.quotedCast[0]?.url : '#';

	console.log('quote_profileImage', quote_profileDisplayName);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: 100, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
				whileInView={{ opacity: 1, y: 0, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
				exit={{ opacity: 0, y: 100, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
				whileHover={{
					paddingTop: 24,
					paddingBottom: 24,
					backgroundColor: colors.neutral[50],
				}}
				transition={{ type: 'spring', stiffness: 200, damping: 20 }}
				className="px-4 cursor-default rounded-xl shadow-sm relative"
				key={hash}
			>
				<div className="md:flex md:space-x-8 items-start">
					<div className="flex mb-4 md:mb-0 space-x-2 md:space-x-0 md:flex-col md:space-y-2 items-center justify-between md:justify-center">
						<img src={pfp} className="w-10 h-10 rounded-full ring-2 ring-black/10" />
						<EngagementFlair count={engagement_count} />
					</div>
					<div className="space-y-4">
						<div className="">
							<ReactLinkify>
								<div className="text-neutral-900 mt-2 text-sm text-[14px] font-sans whitespace-pre-wrap possible-link break-words">
									{isQuoteCast ? text : text}
								</div>
							</ReactLinkify>
							{isQuoteCast && (
								<div className="shadow-sm w-full border-black/10 rounded-xl mt-2 p-4 flex space-x-4 h-[70px] overflow-hidden bg-gradient-to-b from-white to-transparent text-transparent">
									<img src={quote_profileImage} className="w-6 h-6 aspect-square rounded-full ring-2 ring-black/10" />
									<ReactLinkify>
										<div className="bg-clip-text bg-gradient-to-b from-black via-black/50 to-transparent text-sm text-[14px] font-sans whitespace-pre-wrap possible-link break-words">
											{isQuoteCast ? quote_text : quote_text}
										</div>
									</ReactLinkify>
								</div>
							)}
							<EmbedPreview embeds={embeds} />
						</div>
						<div id="flairs" className="flex space-x-2 overflow-scroll no-scrollbar">
							{i == 0 && <MostEngagedFlair />}
							{parent_cast_hash && <ReplyFlair />}
							{/* {isQuoteCast && <QuoteCastFlair />} */}
							<TimeFlair time={time} />
						</div>
						<div className="" id="action-panel">
							{url && url != '#' && (
								<div className="absolute right-4 bottom-2 opacity-15 hover:opacity-85 transition-all duration-300">
									<ExplainUI text={'View on Warpcast'}>
										<Link target="_blank" href={url}>
											<img className="size-5" src="/warpcast.svg" />
										</Link>
									</ExplainUI>
								</div>
							)}

							{channelId && channelName && (
								<ExplainUI text="View channel">
									<Link target="_blank" href={channelURL}>
										<ChannelFlair
											channel={{
												channelId,
												channelName,
												imageURL,
											}}
										/>
									</Link>
								</ExplainUI>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default TopCastPreview;
