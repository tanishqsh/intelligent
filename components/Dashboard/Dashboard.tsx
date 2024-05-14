'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
	const { ready, authenticated, login, logout, user } = usePrivy();

	if (!ready) {
		return null;
	}

	return <div className="min-h-screen bg-neutral-100">{/* <h1>Dashboard</h1> */}</div>;
}
