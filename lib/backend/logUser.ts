import axios from 'axios';
import { endpoints } from './endpoints';
import toastStyles from '@/utils/toastStyles';

const logUser = async (userFromPrivy: any, accessToken: string, toast: any, logout: any) => {
	// set the authorization header
	axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

	if (!userFromPrivy || !accessToken) {
		console.error('Invalid user data');
		logout();
	}

	try {
		await axios.post(endpoints.log_user.path, { user: userFromPrivy });
	} catch (error: any) {
		if (error.response.status === 403) {
			toast.error('Sorry! This account is not in the allowlist. Get early access by subscribing to Hypersub (bottom left), and DM @tanishq for access.', {
				...toastStyles.error,
				duration: 10000,
			});
		} else {
			console.error('Failed to log user, please try again later');
		}
		logout();
	}
};

export { logUser };
