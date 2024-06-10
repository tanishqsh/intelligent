const rootUrl = process.env.NEXT_PUBLIC_ENV === 'dev' ? 'http://localhost:3000' : 'https://api.intelligent.wtf';

const endpoints = {
	sync_cast: {
		path: `${rootUrl}/api/sync-cast`,
		type: 'GET',
		query: 'castUrl',
	},
	get_alfafrens: {
		path: `${rootUrl}/api/alfafrens/getUserStats`,
		type: 'GET',
		query: 'fid',
	},
	log_user: {
		path: `${rootUrl}/api/user/log-user`,
		type: 'POST',
	},
	get_chart1: {
		path: `${rootUrl}/api/mimir/get-chart1`,
		type: 'GET',
	},
	sync_user_data: {
		path: `${rootUrl}/api/mimir/sync-user-data`,
		type: 'POST',
	},
};

export { rootUrl, endpoints };
