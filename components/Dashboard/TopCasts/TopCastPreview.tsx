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

const TopCastPreview = ({ cast, i, pfp }: { cast: any; i: any; pfp: any }) => {
	let parent_cast_fid = cast?.parent_cast_fid;
	let parent_cast_hash = cast?.parent_cast_hash;
	let parent_cast_url = cast?.parent_cast_url;
	let text = cast?.text;
	let engagement_count = cast?.engagement_count;
	let hash = cast?.cast_hash;
	let time = cast?.cast_time;
	let embeds = cast?.embeds;

	let isQuoteCast = embeds?.some((embed: any) => embed?.castId);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
				animate={{ opacity: 1, y: 0, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
				exit={{ opacity: 0, y: 30, paddingTop: 16, paddingBottom: 16, backgroundColor: colors.neutral[50] }}
				whileHover={{
					paddingTop: 24,
					paddingBottom: 24,
					backgroundColor: colors.neutral[100],
				}}
				transition={{ type: 'spring', stiffness: 200, damping: 20 }}
				className="px-4 cursor-default"
				key={hash}
			>
				<div className="flex space-x-4 items-start">
					<img src={pfp} className="w-10 h-10 rounded-full" />
					<div>
						<ReactLinkify>
							<div className="text-neutral-600 text-[14px] font-sans whitespace-pre-wrap possible-link break-words">{text}</div>
						</ReactLinkify>
						<EmbedPreview embeds={embeds} />
						<div id="flairs" className="flex space-x-2">
							{i == 0 && <MostEngagedFlair />}
							<EngagementFlair count={engagement_count} />
							<TimeFlair time={time} />
							{parent_cast_hash && <ReplyFlair />}
							{isQuoteCast && <QuoteCastFlair />}
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default TopCastPreview;
