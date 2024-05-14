import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/utils/providers';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const general_sans = localFont({
	src: './fonts/GeneralSans-Variable.ttf',
	display: 'swap',
	variable: '--font-generalSans',
});

const space_mono = Space_Mono({ weight: ['400', '700'], variable: '--font-spaceMono', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Intelligent',
	description: 'Deeper connections with your audience',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${general_sans.variable} ${space_mono.variable} ${inter.variable} `}>
			<body>
				<Toaster position="top-center" reverseOrder={false} />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
