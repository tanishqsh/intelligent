'use client';

import usePlayerData from './hooks/usePlayerData';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';
import colors from '@/utils/colors';
import SearchBar from './SearchBar';

type Player = {
	attributes: { value: string }[];
	user: {
		userId: string;
		profileImage: string;
		profileDisplayName: string;
		profileHandle: string;
		farRank: string;
		farScore: string;
		followerCount: string;
		followingCount: string;
		profileBio: string;
	};
	tokenId: string;
};

export default function BasedGames() {
	const { data } = usePlayerData();
	const [selectedClans, setSelectedClans] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');

	// Sort the data using a dedicated function
	const sortedData = sortPlayers(data);

	// Filter the data based on the selected clans and search query
	const filteredData = useMemo(() => {
		let result = sortedData;
		if (selectedClans.length > 0) {
			result = result.filter((player: Player) => selectedClans.includes(player?.attributes[0]?.value));
		}
		if (searchQuery) {
			result = result.filter((player: Player) => player.user.profileDisplayName?.toLowerCase().includes(searchQuery.toLowerCase()));
		}
		return result;
	}, [sortedData, selectedClans, searchQuery]);

	const toggleClanSelection = (clan: string) => {
		setSelectedClans((prevSelectedClans) =>
			prevSelectedClans.includes(clan) ? prevSelectedClans.filter((selectedClan) => selectedClan !== clan) : [...prevSelectedClans, clan]
		);
	};

	const clans = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Theta', 'Sigma', 'Kappa', 'Omega'];

	// Count the number of players in each clan
	const clanCounts = useMemo(() => {
		const counts: { [key: string]: number } = {};
		sortedData?.forEach((player: Player) => {
			const clan = player?.attributes[0]?.value || 'No clan';
			counts[clan] = (counts[clan] || 0) + 1;
		});
		return counts;
	}, [sortedData]);

	return (
		<div className="min-h-screen bg-neutral-100 pb-24 px-4 md:px-0">
			<div className="max-w-7xl m-auto space-y-4 pt-6 md:pt-12">
				<h1 className="text-xl font-bold mb-4">All players</h1>
				<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className="mb-4">
					<div className="flex flex-wrap gap-2">
						{clans.map((clan: string, index: number) => (
							<div
								key={index}
								className={`relative px-2 py-1 rounded-sm cursor-pointer ${selectedClans.includes(clan) ? 'z-0' : ''}`}
								onClick={() => toggleClanSelection(clan)}
							>
								<motion.p
									className={`text-xs`}
									animate={{ color: selectedClans.includes(clan) ? colors.neutral[500] : colors.neutral[500] }}
									whileHover={{ color: colors.neutral[400] }}
								>
									{clan} ({clanCounts[clan] || 0})
								</motion.p>
								{selectedClans.includes(clan) && (
									<motion.div
										className="absolute inset-0 bg-intelligent-yellow/30 rounded-lg"
										layoutId={'clanSelector' + index}
										initial={false}
										transition={{ type: 'spring', stiffness: 200, damping: 20 }}
									/>
								)}
							</div>
						))}
					</div>
				</div>
				<AnimatePresence mode="popLayout">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{filteredData &&
							filteredData.map((player: Player, index: number) => (
								<motion.div
									initial={{ y: 10, opacity: 0 }}
									whileInView={{ y: 0, opacity: 1 }}
									exit={{ y: 10, opacity: 0 }}
									transition={{ type: 'spring', stiffness: 300, damping: 50, ease: 'easeInOut' }}
									key={player.tokenId}
									className="flex-grow"
								>
									<PlayerCard player={player} />
								</motion.div>
							))}
					</div>
				</AnimatePresence>
			</div>
		</div>
	);
}

const sortPlayers = (data: Player[] | undefined): Player[] => {
	if (!data) return [];

	return data.slice().sort((a: Player, b: Player) => {
		const aTokenId = a?.tokenId ?? '';
		const bTokenId = b?.tokenId ?? '';
		const aProfileDisplayName = a?.user ? a.user.profileDisplayName : '';
		const bProfileDisplayName = b?.user ? b.user.profileDisplayName : '';

		// Push players with profileDisplayName to the end
		if (aProfileDisplayName && !bProfileDisplayName) return -1;
		if (!aProfileDisplayName && bProfileDisplayName) return 1;

		// Sort by tokenId
		if (aTokenId < bTokenId) return -1;
		if (aTokenId > bTokenId) return 1;
		return 0;
	});
};

const getClanSymbol = (clanName: string): string => {
	const clanSymbols: { [key: string]: string } = {
		Alpha: 'α',
		Beta: 'β',
		Gamma: 'γ',
		Delta: 'δ',
		Theta: 'θ',
		Sigma: 'σ',
		Kappa: 'κ',
		Omega: 'Ω',
	};
	return clanSymbols[clanName] || 'Unknown';
};

const getClanStyles = (clanName: string): { color: string; backgroundColor: string } => {
	const clanStyles: { [key: string]: { color: string; backgroundColor: string } } = {
		Alpha: { color: 'text-red-700', backgroundColor: 'bg-red-50' },
		Beta: { color: 'text-green-700', backgroundColor: 'bg-green-50' },
		Gamma: { color: 'text-blue-700', backgroundColor: 'bg-blue-50' },
		Delta: { color: 'text-yellow-700', backgroundColor: 'bg-yellow-50' },
		Theta: { color: 'text-teal-700', backgroundColor: 'bg-teal-50' },
		Sigma: { color: 'text-gray-700', backgroundColor: 'bg-gray-50' },
		Kappa: { color: 'text-orange-700', backgroundColor: 'bg-orange-50' },
		Omega: { color: 'text-black', backgroundColor: 'bg-gray-50' },
	};
	return clanStyles[clanName] || { color: 'text-neutral-700', backgroundColor: 'bg-neutral-200' };
};

const PlayerCard = ({ player }: { player: Player }) => {
	const [isHover, setIsHover] = useState(false);

	const isFarcasterConnected = player?.user != null;
	const profileImage = player?.user?.profileImage?.startsWith('ipfs://')
		? `https://avatar.iran.liara.run/public?id=${player?.tokenId}`
		: player?.user?.profileImage || `https://avatar.iran.liara.run/public?id=${player?.tokenId}`;
	const profileDisplayName = player?.user?.profileDisplayName || 'NFT #' + player?.tokenId;
	const profileHandle = player?.user?.profileHandle || 'N/A';
	const farRank = player?.user?.farRank ?? 'N/A';
	const farScore = player?.user?.farScore ?? 'N/A';
	const followerCount = player?.user?.followerCount ?? 'N/A';
	const followingCount = player?.user?.followingCount ?? 'N/A';
	const profileBio = player?.user?.profileBio || 'No bio available';
	const clan = player?.attributes[0]?.value || 'No clan';
	const clanSymbol = getClanSymbol(clan);
	const clanStyles = getClanStyles(clan);
	const tokenId = player?.tokenId;

	const isUnknownPlayer = !player?.user;

	let warpcast_URL = player?.user?.profileHandle
		? `https://warpcast.com/${player?.user?.profileHandle}`
		: player?.tokenId
		? `https://api.intelligent.xyz/warpcast/${player?.tokenId}`
		: 'https://api.intelligent.xyz/warpcast/unknown';

	const handleClick = () => {
		if (tokenId) {
			window.open(warpcast_URL, '_blank');
			console.log('Opening warpcast URL:', warpcast_URL);
		}
	};

	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: isUnknownPlayer ? 0.5 : 1 }}
			whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 1)' }}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			transition={{ type: 'spring', stiffness: 250, damping: 10 }}
			className={`relative bg-white/70 w-full md:w-[300px] h-auto mb-4 mr-4 rounded-xl p-6 overflow-clip shadow-sm antialiased ${
				tokenId ? 'cursor-pointer' : 'cursor-default'
			}`}
			onClick={handleClick}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<span>
						{profileImage && (
							<img
								src={profileImage}
								className="w-14 h-14 rounded-full border-intelligent-yellow border-2"
								alt={`${profileDisplayName}'s profile`}
							/>
						)}
					</span>
					<h3 className="font-medium text-xl text-black cursor-default">
						{profileDisplayName}
						<span className="ml-2 text-sm text-gray-500">#{tokenId}</span>
					</h3>
					<p className="text-sm text-neutral-400 cursor-default">{profileHandle.startsWith('@') ? profileHandle : `@${profileHandle}`}</p>
					<p className="mt-2 text-neutral-400 absolute top-2 right-2 text-base cursor-default">
						<ExplainUI text={clan}>
							<span className={`inline-block ${clanStyles.color} text-base font-semibold mr-2 px-2.5 py-0.5 rounded-full`}>{clanSymbol}</span>
						</ExplainUI>
					</p>
				</div>
			</div>
		</motion.div>
	);
};
