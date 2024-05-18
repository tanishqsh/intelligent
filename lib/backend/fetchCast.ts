import axios from 'axios';
import { endpoints } from './endpoints';

const fetchCast = async (castUrl: string) => {
	const url = `${endpoints.sync_cast.path}?castUrl=${encodeURIComponent(castUrl)}`;
	const response = await axios.get(url);
	console.log(response.data);
	if (response.data.error) {
		console.error(response.data.message);
		return;
	}

	if (response.data.success) {
		console.log(response.data);
	} else {
		console.error('Failed to fetch cast, please try again later');
	}

	return response.data;
};

export { fetchCast };
