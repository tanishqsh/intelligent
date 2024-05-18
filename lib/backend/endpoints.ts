const rootUrl = process.env.NEXT_PUBLIC_ENV === 'dev' ? 'http://localhost:3000' : 'http://localhost:3000';

const endpoints = {
	sync_cast: {
		path: `${rootUrl}/api/sync-cast`,
		type: 'GET',
		query: 'castUrl',
		notes: 'Fetches the cast from the given Warpcast URL',
	},
};

export { rootUrl, endpoints };
