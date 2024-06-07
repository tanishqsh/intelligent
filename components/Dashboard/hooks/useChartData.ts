import axios from 'axios';
import useSWR from 'swr';
import { usePrivy } from '@privy-io/react-auth';
import { endpoints } from '@/lib/backend/endpoints';
import Duration from '../Overview/Duration';

const fetcher = async (url: string, token: string) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const response = await axios.get(url);
	return response.data.graphData;
};

export const useChartData = (interval = '24 hours') => {
	console.log(`UseChartData called at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`);

	const { ready, user, getAccessToken } = usePrivy();

	const swrKey = ready && user?.farcaster?.fid ? `${endpoints.get_chart1.path}?fid=${user.farcaster.fid}&duration=${interval}` : null;

	const { data, error } = useSWR(
		swrKey,
		async (url) => {
			const token = await getAccessToken();
			if (!token) {
				throw new Error('No token available');
			}
			return fetcher(url, token);
		},
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			refreshInterval: 0,
		}
	);

	console.log('Graph Data', data, 'Error', error);

	return { chartData: data, error };
};
