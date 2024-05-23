import axios from 'axios';
import { endpoints } from './endpoints';

const fetchCast = async (castUrl: string, accessToken: string) => {
	if (!castUrl || !accessToken) {
		console.error('Invalid cast data');
		return;
	}

	axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

	const url = `${endpoints.sync_cast.path}?castUrl=${encodeURIComponent(castUrl)}`;
	const response = await axios.get(url);

	if (response.data.error) {
		console.error(response.data.message);
		return;
	}

	if (response.data.success) {
		console.log('Successfully fetched cast');
	} else {
		console.error('Failed to fetch cast, please try again later');
	}

	return response.data;
};

export { fetchCast };
