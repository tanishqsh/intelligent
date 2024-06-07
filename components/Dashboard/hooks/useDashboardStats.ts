import { useMemo } from 'react';
import useUserStatisticsData from './useUserStatisticsData';
import { usePrivy } from '@privy-io/react-auth';

const calculatePercentageChange = (current: number, previous: number): string => {
	if (previous === 0) return 'N/A';
	return (((current - previous) / previous) * 100).toFixed(2);
};

const formatChange = (value: string): string => {
	const parsedValue = parseFloat(value);
	return (parsedValue > 0 ? '' : '') + value + '%';
};

const extractFollowerStats = (followers_stat: any) => {
	if (!followers_stat)
		return {
			gain_7d: 0,
			gain_24h: 0,
			gain_30d: 0,
			gain_180d: 0,
			gain_prev_7d: 0,
			gain_prev_24h: 0,
			gain_prev_30d: 0,
			gain_prev_180d: 0,
			follower_gain_percentage_change_24h: 'N/A',
			follower_gain_percentage_change_7d: 'N/A',
			follower_gain_percentage_change_30d: 'N/A',
			follower_gain_percentage_change_180d: 'N/A',
		};

	const { gain_7d, gain_24h, gain_30d, gain_180d, gain_prev_7d, gain_prev_24h, gain_prev_30d, gain_prev_180d } = followers_stat;

	return {
		gain_7d,
		gain_24h,
		gain_30d,
		gain_180d,
		gain_prev_7d,
		gain_prev_24h,
		gain_prev_30d,
		gain_prev_180d,
		follower_gain_percentage_change_24h: formatChange(calculatePercentageChange(gain_24h, gain_prev_24h)),
		follower_gain_percentage_change_7d: formatChange(calculatePercentageChange(gain_7d, gain_prev_7d)),
		follower_gain_percentage_change_30d: formatChange(calculatePercentageChange(gain_30d, gain_prev_30d)),
		follower_gain_percentage_change_180d: formatChange(calculatePercentageChange(gain_180d, gain_prev_180d)),
	};
};

const extractMentionStats = (mentions_stat: any) => {
	if (!mentions_stat)
		return {
			mentions_30d: 0,
			mentions_180d: 0,
			mentions_24h: 0,
			mentions_7d: 0,
			mentions_prev_7d: 0,
			mentions_prev_24h: 0,
			mentions_prev_30d: 0,
			mentions_prev_180d: 0,
			mentions_percentage_change_24h: 'N/A',
			mentions_percentage_change_7d: 'N/A',
			mentions_percentage_change_30d: 'N/A',
			mentions_percentage_change_180d: 'N/A',
		};

	const { mentions_30d, mentions_180d, mentions_24h, mentions_7d, mentions_prev_7d, mentions_prev_24h, mentions_prev_30d, mentions_prev_180d } =
		mentions_stat;

	return {
		mentions_30d,
		mentions_180d,
		mentions_24h,
		mentions_7d,
		mentions_prev_7d,
		mentions_prev_24h,
		mentions_prev_30d,
		mentions_prev_180d,
		mentions_percentage_change_24h: formatChange(calculatePercentageChange(mentions_24h, mentions_prev_24h)),
		mentions_percentage_change_7d: formatChange(calculatePercentageChange(mentions_7d, mentions_prev_7d)),
		mentions_percentage_change_30d: formatChange(calculatePercentageChange(mentions_30d, mentions_prev_30d)),
		mentions_percentage_change_180d: formatChange(calculatePercentageChange(mentions_180d, mentions_prev_180d)),
	};
};

const extractReactionStats = (reactions_stat: any) => {
	if (!reactions_stat)
		return {
			reactions_7d: 0,
			reactions_30d: 0,
			reactions_180d: 0,
			reactions_24h: 0,
			reactions_prev_7d: 0,
			reactions_prev_24h: 0,
			reactions_prev_30d: 0,
			reactions_prev_180d: 0,
			reactions_percentage_change_24h: 'N/A',
			reactions_percentage_change_7d: 'N/A',
			reactions_percentage_change_30d: 'N/A',
			reactions_percentage_change_180d: 'N/A',
		};

	const { reactions_7d, reactions_30d, reactions_180d, reactions_24h, reactions_prev_7d, reactions_prev_30d, reactions_prev_180d, reactions_prev_24h } =
		reactions_stat;

	return {
		reactions_7d,
		reactions_30d,
		reactions_180d,
		reactions_24h,
		reactions_prev_7d,
		reactions_prev_30d,
		reactions_prev_180d,
		reactions_prev_24h,
		reactions_percentage_change_24h: formatChange(calculatePercentageChange(reactions_24h, reactions_prev_24h)),
		reactions_percentage_change_7d: formatChange(calculatePercentageChange(reactions_7d, reactions_prev_7d)),
		reactions_percentage_change_30d: formatChange(calculatePercentageChange(reactions_30d, reactions_prev_30d)),
		reactions_percentage_change_180d: formatChange(calculatePercentageChange(reactions_180d, reactions_prev_180d)),
	};
};

export const useDashboardStats = () => {
	const { ready, user } = usePrivy();

	const { userStatistics, error } = useUserStatisticsData(user?.farcaster?.fid?.toString() || '', ready);

	const stats = useMemo(() => {
		if (!userStatistics) return null;

		const { followers, followers_stat, mentions_stat, reactions_stat, lastSynched } = userStatistics;

		return {
			followers,
			...extractFollowerStats(followers_stat),
			...extractMentionStats(mentions_stat),
			...extractReactionStats(reactions_stat),
			lastSynched,
		};
	}, [userStatistics]);

	return { stats, error };
};
