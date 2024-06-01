'use client';

import colors from '@/utils/colors';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import HighlightedText from '../ui/HighlightedText/HighlightedText';
import EngagementChart from './EngagementChart';
import data from './line_chart.json';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endpoints } from '@/lib/backend/endpoints';

type ChartData = {
	id: string;
	data: { x: string; y: number }[];
};

export default function Dashboard() {
	const [chartData, setChartData] = useState<ChartData[]>([]);
	const [hoveredUserStat, setHoveredUserStat] = useState(null);

	const { ready, authenticated, login, logout, user, getAccessToken } = usePrivy();

	const fetchChartData = async () => {
		const accessToken = getAccessToken();
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		const fid = user?.farcaster?.fid;
		const response = await axios.get(`${endpoints.get_chart1.path}?fid=${fid}`);

		setChartData(response.data.graphData);
	};

	useEffect(() => {
		const fid = user?.farcaster?.fid;

		if (ready && fid) {
			fetchChartData();
		}
	}, [user]);

	if (!ready) {
		return null;
	}

	console.log(hoveredUserStat, 'hoveredUserStat');

	return (
		<div className="min-h-screen bg-neutral-100 pt-12">
			<div className="flex rounded-2xl max-w-7xl m-auto bg-white/50 shadow-sm items-start justify-start">
				<div className="h-[500px] w-full">
					<EngagementChart setHoveredUserStat={setHoveredUserStat} data={chartData} />
					{/* <button onClick={fetchChartData}>Fetch Data</button> */}
				</div>
			</div>
		</div>
	);
}

const ComingSoon = () => {
	return (
		<div className="h-screen bg-neutral-100 flex items-center justify-center">
			<div className="space-y-8 mt-[-200px]">
				<div className="space-y-2 h-[100px] overflow-hidden">
					{[...Array(10)].map((_, index) => (
						<motion.div
							key={index}
							initial={{ width: '200px', height: '20px', translateY: '40px', background: colors.neutral[100] }}
							animate={{ width: '200px', height: '20px', translateY: '-40px', background: colors.neutral[200] }}
							transition={{
								duration: 5,
								repeat: Infinity,
								delay: index * 0.5,
								backgroundTransition: { delay: 2.5 },
							}}
							className="h-[20px] w-[200px] rounded-full m-auto"
						></motion.div>
					))}
				</div>
				<motion.p
					initial={{ opacity: 0, translateY: 20 }}
					animate={{ opacity: 1, translateY: 0 }}
					transition={{ type: 'spring', stiffness: 100 }}
					className="text-black max-w-xs text-center leading-tight font-general-sans font-medium text-4xl"
				>
					Your <HighlightedText> dashboard </HighlightedText> will be here soon.
				</motion.p>
			</div>
		</div>
	);
};
