'use client';

import { useRouter } from 'next/navigation';
import HighlightedText from '../ui/HighlightedText/HighlightedText';
import { useState } from 'react';

const LockSVG = () => (
	<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.75"
			d="M5.75 11.75C5.75 11.1977 6.19772 10.75 6.75 10.75H17.25C17.8023 10.75 18.25 11.1977 18.25 11.75V17.25C18.25 18.3546 17.3546 19.25 16.25 19.25H7.75C6.64543 19.25 5.75 18.3546 5.75 17.25V11.75Z"
		></path>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.75"
			d="M7.75 10.5V10.3427C7.75 8.78147 7.65607 7.04125 8.74646 5.9239C9.36829 5.2867 10.3745 4.75 12 4.75C13.6255 4.75 14.6317 5.2867 15.2535 5.9239C16.3439 7.04125 16.25 8.78147 16.25 10.3427V10.5"
		></path>
	</svg>
);

const UnlockSVG = () => (
	<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.75"
			d="M5.75 11.75C5.75 11.1977 6.19772 10.75 6.75 10.75H17.25C17.8023 10.75 18.25 11.1977 18.25 11.75V17.25C18.25 18.3546 17.3546 19.25 16.25 19.25H7.75C6.64543 19.25 5.75 18.3546 5.75 17.25V11.75Z"
		></path>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.75"
			d="M7.75 10.5V9.84343C7.75 8.61493 7.70093 7.29883 8.42416 6.30578C8.99862 5.51699 10.0568 4.75 12 4.75C14 4.75 15.25 6.25 15.25 6.25"
		></path>
	</svg>
);

export default function GetAccessButton() {
	const [isHovered, setIsHovered] = useState(false);

	const router = useRouter();
	const url = 'https://hypersub.withfabric.xyz/collection/intelligent';

	const handleClick = () => {
		router.push(url);
	};

	return (
		<button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
			<HighlightedText>
				<span className="flex items-center space-x-2">
					{!isHovered ? <LockSVG /> : <UnlockSVG />}
					<p className="font-medium text-lg"> get early access </p>
				</span>
			</HighlightedText>
		</button>
	);
}
