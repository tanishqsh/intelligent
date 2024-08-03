'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import AppsSVG from './SVG/AppsSVG';

const Subheader = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

	const tabs = [
		{
			name: 'Dashboard',
			route: '/dashboard',
		},
		{
			name: 'Apps',
			isIcon: true,
			route: '/dashboard/apps',
			icon: <AppsSVG />,
		},
	];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const activeIndex = tabs.findIndex((tab) => tab.name === activeTab.name);

	const route = useRouter();

	const setTabAndRoute = (tab: any) => {
		setActiveTab(tab);
		route.push(tab.route);
		window.scrollTo(0, 0);
	};

	return (
		<div className="hidden md:block fixed bottom-0 left-0 right-0">
			<div className="flex items-center justify-center py-8">
				<motion.div className="bg-white z-[9999] shadow-2xl relative inline-block rounded-full text-center p-1">
					<div className="relative flex items-center justify-center">
						<motion.div
							className="absolute bg-intelligent-yellow/50 z-1 rounded-full"
							layout
							layoutId="tab"
							initial={false}
							animate={{ left: `${(100 / tabs.length) * activeIndex}%` }}
							transition={{ type: 'spring', stiffness: 200, damping: 30 }}
							style={{ width: `${100 / tabs.length}%`, height: '100%', top: 0, bottom: 0 }}
						/>
						{tabs.map((tab, index) => (
							<div
								key={index}
								onClick={() => setTabAndRoute(tab)}
								className={`text-sm font-medium rounded-full px-4 min-w-[100px] py-3 cursor-pointer flex items-center justify-center space-x-2 z-10 ${
									activeTab.name === tab.name ? 'text-black/60' : 'text-black/50'
								}`}
								style={{ width: `${100 / tabs.length}%`, textAlign: 'center' }}
							>
								{tab.isIcon && <span> {tab.icon}</span>} <span>{tab.name}</span>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Subheader;
