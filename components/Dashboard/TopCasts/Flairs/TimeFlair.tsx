import { formatTimestamp, getRelativeTime } from '../utils';

const TimeFlair = ({ time }: { time: any }) => {
	let formattedTime = formatTimestamp(time);
	let relativeTime = getRelativeTime(time);

	return (
		<div className="mt-4 font-medium text-neutral-500 inline-flex items-center space-x-2 rounded-full bg-neutral-700/5 px-2 py-1">
			<p className="text-xs">{formattedTime}</p>
			<p className="text-xs opacity-50">{relativeTime}</p>
		</div>
	);
};

export default TimeFlair;
