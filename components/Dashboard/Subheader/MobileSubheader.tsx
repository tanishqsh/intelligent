'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import OverviewSVG from './SVG/OverviewSVG';
import SubscribersSVG from './SVG/SubscribersSVG';
import AnalyzeSVG from './SVG/AnalyzeSVG';

const MobileSubheader = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

	const tabs = [
		{
			name: 'Overview',
			route: '/dashboard',
			svg: <OverviewSVG />,
		},
		{
			name: 'Analyze',
			route: '/dashboard/cast-analyze',
			svg: <AnalyzeSVG />,
		},
		{
			name: 'Subscribers',
			route: '/dashboard/hypersub',
			svg: <SubscribersSVG />,
		},

		// {
		// 	name: 'AlfaFrens',
		// 	route: '/dashboard/alfafrens',
		// 	svg: <SubscribersSVG />,
		// },
	];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const activeIndex = tabs.findIndex((tab) => tab.name === activeTab.name);

	const route = useRouter();

	const setTabAndRoute = (tab: any) => {
		setActiveTab(tab);

		route.push(tab.route);
		// scroll to top
		window.scrollTo(0, 0);
	};

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0">
			<div className="flex items-center justify-center bg-white/90 z-[9999] shadow-sm relative backdrop-blur-md rounded-t-2xl text-center p-[2px]">
				{tabs.map((tab, index) => (
					<div
						key={index}
						onClick={() => setTabAndRoute(tab)}
						className={`text-sm font-medium rounded-t-full px-2 flex flex-col items-center justify-center min-w-[100px] py-3 cursor-pointer ${
							activeTab.name === tab.name ? 'text-yellow-800' : 'text-neutral-400'
						}`}
					>
						{tab.svg}
						<p className="text-xs">{tab.name}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default MobileSubheader;
