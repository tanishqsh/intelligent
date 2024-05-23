'use client';

import { motion } from 'framer-motion';
import VideoPlayer from '../VideoPlayer';

const CastPreview = ({ pfp, display_name, username, text, embeds }: { pfp: string; display_name: string; username: string; text: string; embeds: any[] }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 100 }}
			className="bg-white mt-4 rounded-md shadow-sm w-full"
		>
			<div className="flex space-x-4 items-start">
				<div className=" p-6">
					<div className="w-full">
						<div className="flex items-center space-x-4">
							<div>
								<img className="w-12 rounded-full p-1 shadow-inner bg-neutral-100" src={pfp} alt="Profile" />
							</div>
							<div className="flex flex-col items-start justify-start">
								<div className="font-medium text-base text-neutral-600">{display_name}</div>
								<div className="font-medium text-xs text-neutral-400">@{username}</div>
							</div>
						</div>

						<div className="text-sm mt-4 text-neutral-600" dangerouslySetInnerHTML={{ __html: text?.replace(/\n/g, '<br />') }} />
						<div className="w-full m-auto h-auto flex items-center justify-center">
							{embeds?.map((embed: any, index: number) => {
								if (embed?.url?.endsWith('.m3u8')) {
									return (
										<div className="mt-4" key={index}>
											<VideoPlayer src={embed?.url} />
										</div>
									);
								} else if (embed?.url?.match(/\.(jpeg|jpg|gif|png)$/) || embed?.url?.includes('imagedelivery.net')) {
									return (
										<div className="mt-4" key={index}>
											<img className="rounded-md" src={embed?.url} alt="Embed" />
										</div>
									);
								} else {
									return (
										<div className="w-full mt-4 rounded-md" key={index}>
											<iframe src={embed?.url} className="w-full h-96" />
										</div>
									);
								}
							})}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CastPreview;
