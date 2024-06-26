const ChannelFlair = ({
	channel,
}: {
	channel: {
		channelId: string;
		channelName: string;
		imageURL: string;
	};
}) => {
	return (
		<div className="font-medium flex-none text-neutral-700 inline-flex items-center space-x-2 rounded-md bg-neutral-700/5 px-2 py-1">
			<p className="text-xs">{channel?.channelName}</p>
			<img src={channel?.imageURL} className="w-4 h-4 rounded-full" />
		</div>
	);
};

export default ChannelFlair;
