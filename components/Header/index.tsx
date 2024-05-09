'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function Header() {
	const router = useRouter();

	const { ready, authenticated, login, logout, user } = usePrivy();

	if (!ready) {
		return <div>Loading...</div>;
	}

	if (!authenticated) {
		router.replace('/');
	}

	return (
		<header>
			<div className="flex justify-between p-5 items-center">
				<img src="/intelligent.png" alt="Intelligent Logo" className="w-6"></img>
				<div className="space-x-4">
					<button onClick={() => router.replace('/dashboard')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Dashboard
					</button>
					<button onClick={() => router.replace('/dashboard/casts')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						All Casts
					</button>
					<button
						onClick={() => router.replace('/dashboard/cast-analyze')}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Cast Analyze
					</button>
				</div>
				<div>
					<img src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'} alt="Profile Picture" className="rounded-full w-12"></img>
					<h1> @{user?.farcaster?.username}</h1>
					<button
						onClick={() => {
							logout();
							router.replace('/');
						}}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}
