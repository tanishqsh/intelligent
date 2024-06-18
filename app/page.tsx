import LandingPage from '@/components/LandingPage/LandingPage';

export async function generateMetadata() {
	return {
		title: 'Intelligent',
		description: 'Hyper-growth platform – Deep analytics combined with creator tools to manage your audience across multiple ecosystems.',
		openGraph: {
			title: 'Intelligent',
			description: 'Hyper-growth platform – Deep analytics combined with creator tools to manage your audience across multiple ecosystems.',
			url: 'https://intelligent.wtf',
			siteName: 'Intelligent – Farcaster',
			images: [
				{
					url: 'https://intelligent.wtf/og.png', // Must be an absolute URL
					width: 1200,
					height: 640,
				},
			],
			locale: 'en_US',
			type: 'website',
		},
	};
}

export default function Home() {
	return (
		<main>
			<LandingPage />
		</main>
	);
}
