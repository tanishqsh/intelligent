import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ReactLinkify from 'react-linkify';

const TextWithMention = ({
	text,
	mentions,
}: {
	text: string;
	mentions: Array<{ position: number; profile: { profileHandle: string; profileImage: string } }>;
}) => {
	if (!mentions || mentions.length === 0)
		return (
			<ReactLinkify>
				<p>{text}</p>
			</ReactLinkify>
		);

	const sortedMentions = mentions.sort((a, b) => a.position - b.position);
	const parts: Array<React.ReactNode> = [];
	let lastIndex = 0;

	sortedMentions.forEach(({ position, profile: { profileHandle, profileImage } }) => {
		parts.push(text.slice(lastIndex, position));
		lastIndex = position;
		parts.push(
			<span key={profileHandle}>
				<MiniMention profileHandle={profileHandle} profileImage={profileImage} />
			</span>
		);
	});

	parts.push(text.slice(lastIndex));

	return <span className="possible-link">{parts}</span>;
};

export default TextWithMention;

const MiniMention = ({ profileHandle, profileImage }: { profileHandle: string; profileImage: string }) => {
	const [hovered, setHovered] = useState(false);
	return (
		<ExplainUI text={'View @' + profileHandle + ' on Warpcast'}>
			<motion.span
				key={profileHandle}
				initial={{ y: 10, opacity: 0 }}
				whileHover={{ y: -2, opacity: 1 }}
				animate={{ y: 0, opacity: 1 }}
				onHoverStart={() => setHovered(true)}
				onHoverEnd={() => setHovered(false)}
				transition={{ type: 'spring', stiffness: 200, damping: 20 }}
				className="inline-flex items-center space-x-1 px-1 mx-1 py-1 my-1 cursor-pointer shadow rounded-md"
			>
				<span className="rounded-md">
					<motion.img src={profileImage} alt={profileHandle} className="w-4 h-4 rounded-full" />
				</span>
				<span onClick={() => window.open(`https://warpcast.com/${profileHandle}`, '_blank', 'noopener,noreferrer')} className="text-yellow-950">
					{profileHandle}
				</span>
			</motion.span>
		</ExplainUI>
	);
};
