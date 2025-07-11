'use client';

import useGetFid from '@/components/Dashboard/hooks/useGetFid';
import toastStyles from '@/utils/toastStyles';
import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetchAllowanceData = async (url: string) => {
	const response = await axios.get(url);
	return response.data;
};

const AllowanceDisplay = () => {
	const { fid } = useGetFid({});

	const { data, error } = useSWR(`/api/degen?fid=${fid}`, fetchAllowanceData);

	if (!data?.success) return null;

	const allowance = data[0]?.tip_allowance ?? 0;

	if (error) return <div>Failed to load</div>;
	if (!data) return <div className='text-sm'>Loading</div>;

	let degenRate = 0.007;
	let tipAllowance = allowance || 0;
	let tipAllowanceUSD = tipAllowance * degenRate;

	const copyPendingAllowanceToClipboard = () => {
		const string = tipAllowance.toString();
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
			className='flex items-center py-1 pl-2 space-x-1 text-xs font-medium rounded-full cursor-default bg-neutral-400/10 text-neutral-500'
		>
			<span>
				<img className='w-[12px] opacity-50 ' src='/degen.svg' />
			</span>
			{allowance ? (
				<motion.div
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
					className='cursor-pointer text-neutral-500'
				>
					<div className='flex items-center justify-center space-x-[2px]'>
						<motion.div className='px-1'>{tipAllowance ?? 0}</motion.div>
						<motion.div
							initial={{ opacity: 0, width: 0 }}
							animate={{
								opacity: 1,
								width: 'auto',
								transition: {
									duration: 0.1,
								},
							}}
							className='px-1 rounded-full bg-neutral-300'
						>
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
							}).format(tipAllowanceUSD ?? 0)}
						</motion.div>
					</div>
				</motion.div>
			) : (
				<span className='text-xs font-medium text-[#8B5CF6]'>No allowance</span>
			)}
		</motion.div>
	);
};

const DegenAllowance = () => {
	const { ready, authenticated, user } = usePrivy();
	const { fid } = useGetFid({});

	if (!ready || !authenticated || !fid) {
		return null;
	}

	return <AllowanceDisplay />;
};

export default DegenAllowance;
