import VideoPlayer from '@/components/VideoPlayer';
import { motion } from 'framer-motion';

const EmbedPreview = ({ embeds }: { embeds: any }) => {
	return (
		<div className="w-full m-auto h-auto flex items-center justify-start">
			{embeds?.map((embed: any, index: number) => {
				if (embed?.url?.endsWith('.m3u8')) {
					return (
						<div className="rounded-md aspect-video max-w-[300px] border-[10px] border-white shadow-md" key={index}>
							<VideoPlayer src={embed?.url} />
						</div>
					);
				} else if (embed?.url?.match(/\.(jpeg|jpg|gif|png)$/) || embed?.url?.includes('imagedelivery.net')) {
					return (
						<div className="mt-4" key={index}>
							<motion.img
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								whileHover={{ y: -10 }}
								className="rounded-md w-[350px] border-[10px] border-white shadow-md cursor-pointer"
								src={embed?.url}
								alt="Embed"
								onClick={() => window.open(embed?.url, '_blank')}
							/>
						</div>
					);
				} else {
					return <div className="w-full rounded-md" key={index}></div>;
				}
			})}
		</div>
	);
};

export default EmbedPreview;
