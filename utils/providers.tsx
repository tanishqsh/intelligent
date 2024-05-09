'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
	const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

	return (
		<PrivyProvider
			appId={privyAppId}
			config={{
				appearance: {
					theme: 'light',
					accentColor: '#FFAF33',
					logo: 'https://your-logo-url',
				},
				// Create embedded wallets for users who don't have a wallet
				embeddedWallets: {
					createOnLogin: 'users-without-wallets',
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
