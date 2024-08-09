import React from 'react';

interface SearchBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
	return (
		<div className="mb-4">
			<input
				type="text"
				placeholder="Search players"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-full text-sm px-4 py-2 rounded-lg shadow-xs border border-gray-100 placeholder-gray-600 outline-none focus:outline-none"
			/>
		</div>
	);
};

export default SearchBar;
