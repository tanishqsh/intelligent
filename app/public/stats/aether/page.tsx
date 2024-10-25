'use client';

import PublicHeader from '@/components/Public/PublicHeader/PublicHeader';
import TopBar from '@/components/TopBar/TopBar';

export default function StatsPage({ params }: { params: { username: string } }) {
	return (
		<div className='bg-neutral-100'>
			<TopBar />
			<PublicHeader />
			<p> Coming soon</p>
		</div>
	);
}
