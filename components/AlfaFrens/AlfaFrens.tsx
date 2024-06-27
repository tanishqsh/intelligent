'use client';

import { motion } from 'framer-motion';
import useAlfafrensMembers from './hooks/useAlfafrensMembers';
import colors from '@/utils/colors';
import { useState } from 'react';
import toast from 'react-hot-toast';
import toastStyles from '@/utils/toastStyles';

export default function AlfaFrens() {
	const { alfafrensMembers } = useAlfafrensMembers();
	const [searchTerm, setSearchTerm] = useState('');
	const [searchStakersTerm, setSearchStakersTerm] = useState('');

	let activeCount = getActiveCount(alfafrensMembers);
	let activeStakersCount = getActiveStakersCount(alfafrensMembers);
	let activeSubs = getActiveSubs(alfafrensMembers, searchTerm);
	let activeStakers = getActiveStakers(alfafrensMembers, searchStakersTerm);

	if (!alfafrensMembers) {
		return (
			<div className="h-screen bg-neutral-100 text-center text-neutral-300 flex items-center justify-center">
				<p className="mt-[-200px]">No alfafrens subscribers found</p>
			</div>
		);
	}

	return (
		<div className="bg-neutral-100 min-h-screen pb-24">
			<div className="max-w-7xl m-auto pt-12">
				<div className="py-6 flex items-center justify-between">
					<h3 className="text-2xl font-general-sans font-medium text-neutral-700 cursor-default">Subscribers ({activeCount})</h3>
					<div className="space-x-2">
						<motion.button
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							transition={{ type: 'spring', stiffness: 100, damping: 20 }}
							onClick={() => copyAllEthAddresses(activeSubs)}
							className="bg-neutral-200 text-neutral-400 px-4 py-2 rounded-full"
						>
							Copy {getActiveConnectedAddressesCount(activeSubs)} ETH Addresses{' '}
						</motion.button>
						<motion.input
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							whileFocus={{ borderColor: colors.neutral[500] }}
							transition={{ type: 'spring', stiffness: 100 }}
							type="search"
							placeholder="Search"
							className="w-[250px] border-0 rounded-full placeholder-opacity-10 px-4 py-2 outline-none"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				<hr />
				<div className="mt-4 h-[400px] overflow-scroll">
					{activeSubs.map((member: any, i: number) => {
						let fc_data = member?.fc_data;
						let profileImage = fc_data?.profileImage;
						let profileHandle = fc_data?.profileHandle;
						let profileDisplayName = fc_data?.profileDisplayName;

						return (
							<motion.div
								key={i}
								initial={{ opacity: 0, paddingTop: 8, paddingBottom: 8, y: 30, backgroundColor: colors.neutral[100] }}
								animate={{ opacity: 1, paddingTop: 10, paddingBottom: 10, y: 0, backgroundColor: colors.neutral[100] }}
								whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15, backgroundColor: colors.neutral[50] }}
								transition={{ type: 'spring', stiffness: 100, damping: 20 }}
								className="flex items-center space-x-3 px-2"
							>
								<div className="flex items-center space-x-4">
									<img className="w-[48px] border-4 border-neutral-100 h-[48px] rounded-full shadow-inner" src={profileImage} alt="Profile" />
									<div className="flex items-center justify-between space-x-4 w-full">
										<h3 className="text-4xl font-general-sans font-medium text-neutral-700 cursor-default">{profileDisplayName}</h3>
										<h3 className="text-4xl font-general-sans font-medium text-neutral-300 cursor-default">@{profileHandle}</h3>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
				<div className="py-6 flex items-center justify-between">
					<h3 className="text-2xl font-general-sans font-medium text-neutral-700 cursor-default">Stakers ({activeStakersCount})</h3>
					<div className="space-x-2">
						<motion.button
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							transition={{ type: 'spring', stiffness: 100, damping: 20 }}
							onClick={() => copyAllEthAddresses(activeStakers)}
							className="bg-neutral-200 text-neutral-400 px-4 py-2 rounded-full"
						>
							Copy {getActiveConnectedAddressesCount(activeStakers)} ETH Addresses{' '}
						</motion.button>
						<motion.input
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							whileFocus={{ borderColor: colors.neutral[500] }}
							transition={{ type: 'spring', stiffness: 100 }}
							type="search"
							placeholder="Search"
							className="w-[250px] border-0 rounded-full placeholder-opacity-10 px-4 py-2 outline-none"
							onChange={(e) => setSearchStakersTerm(e.target.value)}
						/>
					</div>
				</div>
				<hr />
				<div className="mt-4 h-[400px] overflow-scroll">
					{activeStakers.map((member: any, i: number) => {
						let fc_data = member?.fc_data;
						let profileImage = fc_data?.profileImage;
						let profileHandle = fc_data?.profileHandle;
						let profileDisplayName = fc_data?.profileDisplayName;
						let currentStaked = (member?.currentStaked / Math.pow(10, 14)).toFixed(0);

						return (
							<motion.div
								key={i}
								initial={{ opacity: 0, paddingTop: 8, paddingBottom: 8, y: 30, backgroundColor: colors.neutral[100] }}
								animate={{ opacity: 1, paddingTop: 10, paddingBottom: 10, y: 0, backgroundColor: colors.neutral[100] }}
								whileHover={{ opacity: 1, paddingTop: 15, paddingBottom: 15, backgroundColor: colors.neutral[50] }}
								transition={{ type: 'spring', stiffness: 100 }}
								className="flex items-center space-x-3 px-2"
							>
								<div className="flex items-center space-x-4 w-full">
									<img className="w-[48px] border-4 border-neutral-100 h-[48px] rounded-full shadow-inner" src={profileImage} alt="Profile" />
									<div className="flex items-center justify-between space-x-4 w-full">
										<div className="flex space-x-2">
											<h3 className="text-4xl font-general-sans font-medium text-neutral-700 cursor-default">{profileDisplayName}</h3>
											<h3 className="text-4xl font-general-sans font-medium text-neutral-300 cursor-default">@{profileHandle}</h3>
										</div>

										<div className="flex items-center space-x-2">
											<p className="text-base font-medium text-neutral-500 cursor-default font-mono">{currentStaked} $ALFA</p>
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

const getActiveCount = (subs: any) => {
	// every sub has sub.isSubscribed = true
	return subs.filter((sub: any) => sub.isSubscribed).length;
};

const getActiveStakersCount = (subs: any) => {
	// every sub has sub.isStaked = true
	return subs.filter((sub: any) => sub.isStaked).length;
};

const getActiveSubs = (subs: any, searchTerm: string) => {
	const activeSubs = subs.filter((sub: any) => sub.isSubscribed);
	return searchTerm ? activeSubs.filter((sub: any) => sub.fc_data?.profileDisplayName.toLowerCase().includes(searchTerm.toLowerCase())) : activeSubs;
};

const getActiveStakers = (subs: any, searchTerm: string) => {
	const stakers = subs.filter((sub: any) => sub.isStaked);
	return searchTerm ? stakers.filter((sub: any) => sub.fc_data?.profileDisplayName.toLowerCase().includes(searchTerm.toLowerCase())) : stakers;
};

const copyAllEthAddresses = (subs: any) => {
	let ethAddresses = subs.map((sub: any) => sub?.fc_data?.connectedAddresses?.find((address: any) => address.blockchain === 'ethereum')?.address);
	navigator.clipboard.writeText(ethAddresses.join('\n'));
	toast.success(`All ${ethAddresses.length} ethereum addresses copied to clipboard`, toastStyles.success);
};
const getActiveConnectedAddressesCount = (subs: any) => {
	return subs.filter((sub: any) => sub?.fc_data?.connectedAddresses?.length > 0).length;
};
