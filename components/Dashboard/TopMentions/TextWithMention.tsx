import { motion } from 'framer-motion';
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
		parts.push(<MiniMention profileHandle={profileHandle} profileImage={profileImage} />);
		lastIndex = position;
	});

	parts.push(text.slice(lastIndex));

	return (
		<ReactLinkify>
			<span className="possible-link">{parts}</span>
		</ReactLinkify>
	);
};

export default TextWithMention;

const MiniMention = ({ profileHandle, profileImage }: { profileHandle: string; profileImage: string }) => {
	return (
		<motion.div
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.25 }}
			className="inline-flex items-center space-x-1 cursor-pointer px-1 my-1 py-[2px] shadow rounded-md"
		>
			<img src={profileImage} alt={profileHandle} className="w-4 h-4 rounded-full" />
			<div onClick={() => window.open(`https://warpcast.com/${profileHandle}`, '_blank', 'noopener,noreferrer')} className="text-yellow-950">
				{profileHandle}
			</div>
		</motion.div>
	);
};
