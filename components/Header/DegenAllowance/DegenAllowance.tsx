'use client';

import { usePrivy } from '@privy-io/react-auth';
import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 *
 * @returns Temporarily this segment, later will shift to its own DB
 */
const DegenAllowance = () => {
	const [remainingAllowance, setRemainingAllowance] = useState(0);
	const [totalAllowance, setTotalAllowance] = useState(0);

	const { ready, authenticated, user } = usePrivy();

	const fetchAllowance = async () => {
		try {
			const response = await axios.get('/api/degen?fid=' + user?.farcaster?.fid);
			console.log(response.data);
			setRemainingAllowance(response.data.allowance?.remaining_allowance);
			setTotalAllowance(response.data.allowance?.tip_allowance);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!ready || !authenticated) {
			return;
		}

		fetchAllowance();
	}, []);

	return (
		<div className="px-2 py-1 rounded-full bg-[#f1efff]/10 text-slate-400 shadow-inner text-xs font-medium">
			$DEGEN: {remainingAllowance} / {totalAllowance}
		</div>
	);
};

export default DegenAllowance;
