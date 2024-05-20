import axios from 'axios';
import { endpoints } from './endpoints';

const fetchAlfaFrensData = async (fid: number) => {
	if (!fid) {
		console.error('Invalid FID');
		return;
	}

	const url = `${endpoints.get_alfafrens.path}?fid=${encodeURIComponent(fid)}`;
	const response = await axios.get(url);

	if (response.data.error) {
		console.error(response.data.message);
		return;
	}

	if (response.data.success) {
		console.log('Successfully fetched AlfaFrens');
	} else {
		console.error('Failed to fetch AlfaFrens, please try again later');
	}

	return response.data;
};

export { fetchAlfaFrensData };
