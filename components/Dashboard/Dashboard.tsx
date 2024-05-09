'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
	const { ready, authenticated, login, logout, user } = usePrivy();

	return (
		<div className="max-w-[1440px] m-auto">
			<h1>Dashboard</h1>
		</div>
	);
}
