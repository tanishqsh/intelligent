import axios from 'axios';
import useSWR from 'swr';
import { usePrivy } from '@privy-io/react-auth';
import { endpoints } from '@/lib/backend/endpoints';
import useGetFid from './useGetFid';

const fetcher = async (url: string, token: string) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	const response = await axios.get(url);
	return response.data.graphData;
};

export const useChartData = (interval = '24 hours') => {
	const { ready, user, getAccessToken } = usePrivy();
	const { fid } = useGetFid({});

	const swrKey = ready && fid ? `${endpoints.get_chart1.path}?fid=${fid}&duration=${interval}` : null;

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

	return { chartData: data, error };
};
