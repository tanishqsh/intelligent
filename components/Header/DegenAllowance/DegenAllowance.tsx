'use client';

import toastStyles from '@/utils/toastStyles';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetchAllowanceData = async (url: string) => {
	const response = await axios.get(url);
	return response.data;
};

const AllowanceDisplay = ({ fid }: { fid: string }) => {
	const [showDollarAmount, setShowDollarAmount] = useState(false);
	const { data, error } = useSWR(`/api/degen?fid=${fid}`, fetchAllowanceData);

	const allowance = data?.allowance;

	if (error) return <div>Failed to load</div>;
	if (!data) return <div className="text-sm">Loading</div>;

	let degenRate = 0.008;
	let tipAllowance = allowance?.tip_allowance || 0;
	let tipAllowanceUSD = tipAllowance * degenRate;
	let remainingAllowance = allowance?.remaining_allowance || 0;
	let remainingAllowanceUSD = remainingAllowance * degenRate;

	const copyPendingAllowanceToClipboard = () => {
		const string = remainingAllowance.toString();
		const suffix = ' $DEGEN';

		navigator.clipboard.writeText(string + suffix);
		toast.success('Allowance copied to clipboard', toastStyles.success);
	};

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
				<motion.div
					onMouseEnter={() => setShowDollarAmount(true)}
					onMouseLeave={() => setShowDollarAmount(false)}
					onClick={copyPendingAllowanceToClipboard}
					initial={{ opacity: 0, y: 2 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: {
							type: 'spring',
							stiffness: 200,
						},
					}}
					className="text-neutral-500 cursor-pointer"
				>
					<div className="flex items-center justify-center">
						<motion.div className="px-1">{new Intl.NumberFormat().format(remainingAllowance)}</motion.div>
						<motion.div
							initial={{ opacity: 0, width: 0 }}
							animate={{
								opacity: showDollarAmount ? 1 : 0,
								width: showDollarAmount ? 'auto' : 0,
								transition: {
									duration: 0.1,
								},
							}}
							className="px-1 bg-neutral-300 rounded-full"
						>
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
							}).format(remainingAllowanceUSD)}
						</motion.div>
					</div>

					{/* <span className="text-neutral-400">
						{' '}
						out of {new Intl.NumberFormat().format(tipAllowance)}
						<span className="px-2 py-1 bg-neutral-200 rounded-full m-1">
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
							}).format(tipAllowanceUSD)}
						</span>{' '}
					</span> */}
				</motion.div>
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
