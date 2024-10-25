import axios from 'axios';
import useSWR from 'swr';
import { endpoints } from '@/lib/backend/endpoints';
import { usePrivy } from '@privy-io/react-auth';
import useGetFid from './useGetFid';

const useSetLastActive = () => {
	const { user, getAccessToken } = usePrivy();
	const { fid } = useGetFid({});

	const fetcher = async (url: string) => {
		try {
			const accessToken = await getAccessToken();

			if (!fid || !accessToken) {
				console.error('Invalid user data');
				return;
			}

			// set the authorization header
			axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

			const response = await axios.get(`${url}?fid=${fid}`);
			return response.data;
		} catch (error: any) {
			console.error('Failed to sync data, please try again later', error);
		}
	};

	const { data, error } = useSWR(endpoints.sync_user_data.path, fetcher, { revalidateOnFocus: true });

	return { data, error };
};

export { useSetLastActive };
