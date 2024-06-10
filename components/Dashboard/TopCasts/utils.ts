import dayjs from 'dayjs';
import Duration from '../Overview/Duration';

export const getRelativeTime = (timestamp: { seconds: number; nanoseconds: number }) => {
	const date = new Date(timestamp.seconds * 1000);
	return dayjs(date).fromNow();
};

export const formatTimestamp = (timestamp: { seconds: number; nanoseconds: number }) => {
	const date = dayjs.unix(timestamp.seconds);
	return date.format('ddd, D MMMM YY hh:mm:ss A');
};

export const getDurationString = (duration: string) => {
	switch (duration) {
		case Duration.HOURS_24:
			return 'last 24 hours';
		case Duration.DAYS_7:
			return 'last 7 days';
		case Duration.DAYS_30:
			return 'last 30 days';
		case Duration.DAYS_180:
			return 'last 180 days';
		default:
			return '';
	}
};
