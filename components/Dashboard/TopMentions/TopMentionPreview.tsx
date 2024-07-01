import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { getRelativeTime } from '../TopCasts/utils';
import ReactLinkify from 'react-linkify';
import EmbedPreview from '../TopCasts/EmbedPreview/EmbedPreview';
import EngagementFlair from '../TopCasts/Flairs/EngagementFlair';
import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDuration } from '../DurationContext';

const TopMentionPreview = ({ cast, i }: { cast: any; i: number }) => {
	const [showMention, setShowMention] = useState(false);

	const { duration } = useDuration();

	let displayName = cast?.display;
	let profile_picture = cast?.profile_picture;
	let reaction_count = cast?.reaction_count;
	let text = cast?.text;
	let username = cast?.username || null;
	let timestamp = cast?.timestamp;
	let hash = cast?.hash;
	let embeds = cast?.embeds;

	const relativeTime = getRelativeTime(timestamp || 0);

	let mentions = cast?.meta?.mentions || [];

	let url = cast?.meta?.url || '#';

	useEffect(() => {
		setShowMention(false);
	}, [duration]);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={i + username}
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 10 }}
				transition={{ type: 'spring', stiffness: 200, damping: 20 }}
				className="text-sm text-neutral-600 bg-white space-y-2 rounded-xl shadow-sm px-4 py-4"
			>
				<div className="flex space-x-2 justify-between items-center">
					<div className="flex items-center justify-start space-x-2">
						<EngagementFlair count={reaction_count} />
						<p className="flex space-x-2">
							<img src={profile_picture} className="size-5 rounded-full ring-2 ring-black/10" />
							<span className="text-yellow-700"> {username ? '@' + username : 'Someone'}</span> <span>mentioned you {relativeTime}</span>{' '}
						</p>
					</div>
					<svg
						className={`cursor-pointer ${showMention ? 'rotate-180' : ''}`}
						onClick={() => setShowMention((prevState) => !prevState)}
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.25 10.75L12 14.25L8.75 10.75"></path>
					</svg>
				</div>
				{showMention && (
					<AnimatePresence>
						<div className="flex space-x-2 items-center p-4">
							<img src={profile_picture} className="size-5 rounded-full ring-2 ring-black/10" />
							<span className="text-sm"> {displayName}: </span>
						</div>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="rounded-md shadow-sm px-4 space-y-4 relative"
						>
							<ReactLinkify>
								<p className="whitespace-pre-wrap possible-link">
									<TextWithMention text={text} mentions={mentions} />
								</p>
							</ReactLinkify>
							<EmbedPreview embeds={embeds} />
							{url !== '#' && (
								<Link target="_blank" href={url}>
									<div className="absolute right-4 bottom-4 opacity-20 duration-300 transition-all hover:opacity-80">
										<img className="size-5" src="/warpcast.svg" />
									</div>
								</Link>
							)}
						</motion.div>
					</AnimatePresence>
				)}
			</motion.div>
		</AnimatePresence>
	);
};

const TextWithMention = ({ text, mentions }: { text: string; mentions: Array<{ position: number; profile: { profileHandle: string } }> }) => {
	if (!mentions || mentions.length === 0) return <p>{text}</p>;

	const sortedMentions = mentions.sort((a, b) => a.position - b.position);
	const parts: Array<string> = [];
	let lastIndex = 0;

	sortedMentions.forEach(({ position, profile: { profileHandle } }) => {
		const link = `<a href="https://warpcast.com/${profileHandle}" target="_blank" rel="noopener noreferrer">@${profileHandle}</a>`;
		parts.push(text.slice(lastIndex, position), link);
		lastIndex = position;
	});

	parts.push(text.slice(lastIndex));

	return <span dangerouslySetInnerHTML={{ __html: parts.join('') }} />;
};
export default TopMentionPreview;
