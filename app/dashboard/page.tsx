'use client';

import Dashboard from '@/components/Dashboard/Dashboard';
import { DurationProvider } from '@/components/Dashboard/DurationContext';

export default function Page() {
	return (
		<DurationProvider>
			<Dashboard />
		</DurationProvider>
	);
}
