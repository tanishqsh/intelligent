'use client';

import Logo from '@/components/Header/Logo';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PublicHeader() {
	return (
		<header className='bg-neutral-100'>
			<div className='py-4' id='surroundings'>
				<div className='flex items-center justify-between max-w-7xl m-auto px-4 md:px-0'>
					<div>
						<motion.div
							className='md:w-1/3'
							initial={{ opacity: 0, scale: 0.3 }}
							animate={{ opacity: 1, scale: 0.9 }}
							transition={{
								type: 'spring',
								stiffness: 200,
							}}
						>
							<Link href='/'>
								<Logo className='w-8 h-8' />
							</Link>
						</motion.div>
					</div>

					<div className='flex items-center justify-end space-x-4 md:w-1/3'>
						<div className='px-1 py-1 rounded-full bg-neutral-100 shadow-inner'>
							{/* <img src={user?.farcaster?.pfp || 'https://via.placeholder.com/150'} alt="Profile Picture" className="rounded-full w-8 h-8"></img> */}
						</div>
						<div className='md:block hidden'></div>
					</div>
				</div>
			</div>
		</header>
	);
}
