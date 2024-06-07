'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Subheader = () => {
	const tabs = [
		{
			name: 'Overview',
			route: '/dashboard',
		},
		{
			name: 'Hypersub',
			route: '/dashboard/hypersub',
		},
	];
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const activeIndex = tabs.findIndex((tab) => tab.name === activeTab.name);

	const route = useRouter();

	const setTabAndRoute = (tab: any) => {
		setActiveTab(tab);
		route.push(tab.route);
	};

	return (
		<div className="fixed bottom-8 left-0 right-0 flex items-center justify-center">
			<div className="bg-neutral-200/10 backdrop-blur-sm inline-block rounded-full text-center p-1 border-2 border-neutral-400/10">
				<div className="relative flex items-center justify-center">
					<motion.div
						className="absolute bg-intelligent-yellow/50 rounded-full"
						layout
						layoutId="tab"
						initial={false}
						animate={{ left: `${(100 / tabs.length) * activeIndex}%` }}
						transition={{ type: 'spring', stiffness: 500, damping: 30 }}
						style={{ width: `${100 / tabs.length}%`, height: '100%', top: 0, bottom: 0 }}
					/>
					{tabs.map((tab, index) => (
						<div
							key={index}
							onClick={() => setTabAndRoute(tab)}
							className={`text-sm font-medium rounded-full px-4 min-w-[100px] py-3 cursor-pointer ${
								activeTab.name === tab.name ? 'text-neutral-500' : 'text-neutral-400'
							}`}
							style={{ width: `${100 / tabs.length}%`, textAlign: 'center' }}
						>
							{tab.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Subheader;
