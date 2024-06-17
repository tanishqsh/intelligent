'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseGoerli, mainnet, sepolia } from 'viem/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
	const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';

	const privyAppId = isDev ? process.env.NEXT_PUBLIC_DEV_PRIVY_APP_ID : process.env.NEXT_PUBLIC_PRIVY_APP_ID;

	return (
		<PrivyProvider
			appId={privyAppId || ''}
			config={{
				appearance: {
					theme: 'light',
					accentColor: '#F59E0C',
					logo: 'https://intelligent.wtf/intelligent.png',
				},
				defaultChain: base,
				supportedChains: [base, baseGoerli, mainnet, sepolia],
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
