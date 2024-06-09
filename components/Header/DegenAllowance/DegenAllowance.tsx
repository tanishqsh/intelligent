'use client';

import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const fetchAllowanceData = async (url: string) => {
	const response = await axios.get(url);
	return response.data;
};

const AllowanceDisplay = ({ fid }: { fid: string }) => {
	const { data, error } = useSWR(`/api/degen?fid=${fid}`, fetchAllowanceData);

	const allowance = data?.allowance;

	if (error) return <div>Failed to load</div>;
	if (!data) return <div className="text-sm">Loading</div>;

	let degenRate = 0.019;
	let tipAllowance = allowance?.tip_allowance || 0;
	let tipAllowanceUSD = tipAllowance * degenRate;
	let remainingAllowance = allowance?.remaining_allowance || 0;
	let remainingAllowanceUSD = remainingAllowance * degenRate;

	return (
		<motion.div
			initial={{ opacity: 0, y: 2 }}
			animate={{
				opacity: 1,
				y: 0,
				transition: {
					type: 'spring',
					stiffness: 200,
				},
			}}
			className="px-2 py-1 rounded-full bg-neutral-400/10 text-neutral-500 text-xs font-medium flex items-center space-x-2 cursor-default"
		>
			<span>
				<img className="w-[12px] opacity-50 " src="/degen.svg" />
			</span>
			{allowance ? (
				<motion.span
					initial={{ opacity: 0, y: 2 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: {
							type: 'spring',
							stiffness: 200,
						},
					}}
					className="text-neutral-500"
				>
					{new Intl.NumberFormat().format(remainingAllowance)} (
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
					}).format(remainingAllowanceUSD)}
					)
					<span className="text-neutral-400">
						{' '}
						/ {new Intl.NumberFormat().format(tipAllowance)} (
						{new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
						}).format(tipAllowanceUSD)}
						){' '}
					</span>
				</motion.span>
			) : (
				<span className="text-xs font-medium text-[#8B5CF6]">No allowance</span>
			)}
		</motion.div>
	);
};

const DegenAllowance = () => {
	const { ready, authenticated, user } = usePrivy();

	if (!ready || !authenticated || !user?.farcaster?.fid) {
		return null;
	}

	return <AllowanceDisplay fid={user.farcaster.fid.toString()} />;
};

export default DegenAllowance;
