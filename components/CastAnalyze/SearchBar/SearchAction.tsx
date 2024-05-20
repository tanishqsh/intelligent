'use client';

import colors from '@/utils/colors';
import toast from 'react-hot-toast';
import toastStyles from '@/utils/toastStyles';
import { MotionProps, motion } from 'framer-motion';
import { useState } from 'react';

const SearchAction = ({
	isLoaded,
	setIsLoading,
	beginFetchCast,
	castUrl,
}: {
	isLoaded: boolean;
	setIsLoading: (value: boolean) => void;
	beginFetchCast: () => void;
	castUrl: string;
}) => {
	const animation = {
		initial: {
			paddingRight: 10,
			paddingLeft: 0,
			paddingTop: 12,
			paddingBottom: 12,
			fontWeight: 500,
			color: colors.neutral[400],
		},
		animate: {
			paddingRight: 10,
			paddingLeft: 0,
			paddingTop: 12,
			paddingBottom: 12,
			fontWeight: 500,
			color: isLoaded ? '#22C55E' : colors.neutral[400],
		},
		whileHover: {
			paddingTop: 16,
			paddingBottom: 16,
			opacity: 1,

			color: isLoaded ? '#16A34A' : colors.neutral[600],
		},
		whileTap: {
			scale: 0.95,
		},
		transition: { type: 'spring', stiffness: 100 },
	};

	const handleFetchCast = async () => {
		if (castUrl) {
			setIsLoading(true);
			try {
				await toast.promise(
					// @ts-ignore
					beginFetchCast(),
					{
						loading: 'Please wait, fetching cast',
						success: 'Successfully fetched cast',
						error: 'Failed to fetch cast, please try again later',
					},
					toastStyles.success
				);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		} else {
			toast.error('Please enter a valid Warpcast URL');
		}
	};

	const [isHovered, setIsHovered] = useState(false);
	const [isClicked, setIsClicked] = useState(false);

	return (
		<motion.button
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			initial={animation.initial}
			animate={animation.animate}
			whileHover={animation.whileHover}
			whileTap={animation.whileTap}
			transition={animation.transition}
			onTap={() => setIsClicked(!isClicked)}
			className="text-sm rounded-e-md focus:outline-none flex items-center justify-center cursor-pointer"
			onClick={handleFetchCast}
		>
			{isLoaded ? (
				<span className="flex items-center justify-center">
					<motion.span transition={{ type: 'spring', stiffness: 100 }} animate={{ translateX: isHovered ? 0 : 0 }}>
						Refresh
					</motion.span>
					<RefreshSVG isHovered={isHovered} isClicked={isClicked} />
				</span>
			) : (
				<span className="flex items-center justify-center">
					<motion.span transition={{ type: 'spring', stiffness: 100 }} animate={{ translateX: isHovered ? -16 : 0 }}>
						Analyze
					</motion.span>
					<ArrowSVG isHovered={isHovered} />
				</span>
			)}
		</motion.button>
	);
};

export default SearchAction;

const RefreshSVG = ({ isHovered, isClicked }: { isHovered: boolean; isClicked: boolean }) => {
	return (
		<motion.svg
			initial={{ rotate: 0, opacity: 0 }}
			animate={{ rotate: isClicked ? 180 : isHovered ? 45 : 0, opacity: 1, translateX: -4 }}
			transition={{ type: 'spring', stiffness: 100 }}
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-4 ml-4 text-current"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</motion.svg>
	);
};

const ArrowSVG = ({ isHovered }: { isHovered: boolean }) => {
	return (
		<motion.svg
			initial={{ opacity: 0, translateX: 4 }}
			animate={{
				opacity: isHovered ? 1 : 0,
				translateX: isHovered ? -8 : 0,
				transition: { repeat: Infinity, repeatType: 'reverse', type: 'spring', stiffness: 100 },
			}}
			transition={{ type: 'spring', stiffness: 100 }}
			className="w-4 text-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.75 6.75L19.25 12L13.75 17.25"></path>
			<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H4.75"></path>
		</motion.svg>
	);
};
