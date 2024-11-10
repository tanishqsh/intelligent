'use client';

import TopBar from '@/components/TopBar/TopBar';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';

export default function NotFound() {
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
	return (
		<div className='flex flex-col h-screen justify-between bg-neutral-100 font-general-sans'>
			<TopBar />
			<div className='max-w-7xl m-auto px-4 md:px-8'>
				<motion.h1
					className='md:text-7xl text-4xl font-medium cursor-default'
					initial={{ lineHeight: isMobile ? '' : '110px', opacity: 0, y: 20 }}
					animate={{ lineHeight: isMobile ? '' : '80px', opacity: 1, y: 0 }}
					whileHover={{ lineHeight: isMobile ? '' : '85px' }}
					transition={{ type: 'spring', stiffness: 250 }}
				>
					Oops! Looks like you are lost. <br /> Try heading back to{' '}
					<Link href='/'>
						<motion.span
							className='bg-yellow-400 inline-block rounded-md'
							initial={{ paddingRight: 0 }}
							animate={{ paddingRight: 4, paddingLeft: 4, paddingTop: 4, paddingBottom: 4 }}
							whileHover={{
								paddingRight: 16,
								paddingLeft: 16,
								paddingTop: 4,
								paddingBottom: 4,
								fontWeight: 550,
							}}
							transition={{ type: 'spring', stiffness: 250 }}
						>
							Intelligent
						</motion.span>
					</Link>
				</motion.h1>
			</div>
			<div></div>
		</div>
	);
}
