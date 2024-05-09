'use client';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
	const { ready, authenticated, login, logout, user } = usePrivy();

	const disableButton = !ready || (ready && authenticated);

	const router = useRouter();

	return (
		<div>
			<div className="px-12 py-12 m-auto" id="header">
				<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="24" cy="24" r="24" fill="#FFAF34" />
				</svg>
			</div>
			<div className="px-">
				<div className="text-center">
					<h1 className="text-6xl">
						<span>Intelligent</span>ly engage and form <br /> deeper connections with your audience.
					</h1>
				</div>
			</div>
		</div>
	);
}
