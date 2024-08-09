import React from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
	return (
		<div className="flex rounded-lg bg-neutral-50 shadow-sm mb-4">
			<div className="pl-4 flex w-full">
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					whileHover={{ paddingTop: 12, paddingBottom: 12, transition: { type: 'spring', stiffness: 100 } }}
					whileFocus={{ paddingTop: 12, paddingBottom: 12, transition: { type: 'spring', stiffness: 100 } }}
					className="w-full flex items-center justify-center cursor-text"
				>
					<motion.input
						initial={{ opacity: 1, fontWeight: 500, color: '#000000' }}
						animate={{ opacity: 1, fontWeight: 400, color: '#666666' }}
						whileFocus={{ opacity: 1, paddingRight: 10, fontWeight: 450, filter: 'brightness(1)', color: '#999999' }}
						className="px-3 py-2 focus:outline-none text-sm text-black w-full bg-neutral-50 cursor-text"
						type="text"
						value={searchQuery}
						placeholder="Search Display name"
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</motion.div>
			</div>
		</div>
	);
};

export default SearchBar;
