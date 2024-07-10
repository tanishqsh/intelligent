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
import TextWithMention from '../TopMentions/TextWithMention';

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

	let mentions = cast?.meta?.mentions || [];

	let isQuoteCast = embeds?.some((embed: any) => embed?.castId);

	const quoteProperties = getQuoteProperties(cast, isQuoteCast);

	console.log(cast);

	let quote_profileImage = quoteProperties.quote_profileImage || 'https://placehold.co/1000x1000?text=I';
	let quote_profileHandle = quoteProperties.quote_profileHandle || '';
	let quote_profileDisplayName = quoteProperties.quote_profileDisplayName || '';
	let quote_isPowerUser = quoteProperties.quote_isPowerUser;
	let quote_text = quoteProperties.quote_text || '';
	let quote_url = quoteProperties.quote_url;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
				whileInView={{ opacity: 1, y: 0, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
				exit={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: '#ffffff' }}
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
									<TextWithMention mentions={mentions} text={text} />
								</div>
							</ReactLinkify>
							{isQuoteCast && (
								<a href={quote_url} target="_blank" className="text-neutral-500 text-xs">
									<motion.div
										initial={{ y: 0 }}
										animate={{ backgroundColor: '#fdfdfd' }}
										whileHover={{
											y: -5,
										}}
										transition={{
											type: 'spring',
											stiffness: 200,
											damping: 20,
										}}
										className="shadow w-full border-black/10 rounded-xl mt-2 p-4 flex space-x-4 overflow-hidden"
									>
										<div className="shrink-0 justify-center items-center">
											<ExplainUI text={'@' + quote_profileHandle}>
												<img src={quote_profileImage} className="w-6 h-6 aspect-square rounded-full ring-2 ring-black/10" />
											</ExplainUI>
										</div>
										<div className="w-full text-sm font-sans whitespace-pre-wrap possible-link break-words">
											<ReactLinkify>{isQuoteCast ? quote_text : quote_text}</ReactLinkify>
										</div>
									</motion.div>
								</a>
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
								<ExplainUI text={`View /${channelId} on Warpcast`}>
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

const getQuoteProperties = (cast: any, isQuoteCast: any) => {
	if (!isQuoteCast || !cast?.meta?.quotedCast || !cast.meta.quotedCast[0]) {
		return {
			quote_profileImage: '',
			quote_profileHandle: '',
			quote_profileDisplayName: '',
			quote_isPowerUser: '',
			quote_text: '',
			quote_url: '',
		};
	}

	const quotedCast = cast.meta.quotedCast[0];

	return {
		quote_profileImage: quotedCast.castedBy?.profileImage || '',
		quote_profileHandle: quotedCast.castedBy?.profileHandle || '',
		quote_profileDisplayName: quotedCast.castedBy?.profileDisplayName || '',
		quote_isPowerUser: quotedCast.castedBy?.isFarcasterPowerUser || '',
		quote_text: quotedCast.text || '',
		quote_url: quotedCast.url || '',
	};
};
