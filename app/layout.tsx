import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/utils/providers';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'] });
const general_sans = localFont({
	src: './fonts/GeneralSans-Variable.ttf',
	display: 'swap',
	variable: '--font-generalSans',
});

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
		<html lang="en">
			<body className={general_sans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
