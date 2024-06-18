import { formatTimestamp, getRelativeTime } from '../utils';

const TimeFlair = ({ time }: { time: any }) => {
	let formattedTime = formatTimestamp(time);
	let relativeTime = getRelativeTime(time);

	return (
		<div className="flex-none font-medium antialiased flex-nowrap text-neutral-500 inline-flex items-center space-x-2 rounded-md">
			<p className="text-xs">{formattedTime}</p>
			<p className="text-xs opacity-50">{relativeTime}</p>
		</div>
	);
};

export default TimeFlair;
