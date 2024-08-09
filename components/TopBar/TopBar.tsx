'use client';

import testimonials from '@/utils/testimonials';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TopBar() {
	const [currentTestimonial, setCurrentTestimonial] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
		}, 2500);

		return () => clearInterval(interval);
	}, []);

	const escapeHtml = (unsafe: string) => {
		return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
	};

	return (
		<div className="py-2 bg-yellow-400 px-4 md:px-12">
			<div className="max-w-7xl m-auto flex items-center justify-between flex-col md:flex-row text-center">
				<div></div>
				<div>
					<AnimatePresence mode="popLayout">
						{testimonials.map(
							(testimonial, index) =>
								index === currentTestimonial && (
									<motion.div
										key={index}
										className="text-black/70 flex space-x-2 text-sm cursor-default items-center"
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										transition={{ type: 'spring', stiffness: 100 }}
									>
										<span className="quote">&quot;{escapeHtml(testimonial.quote)}&quot; –</span>
										<img src={testimonial.image} alt={escapeHtml(testimonial.author)} className="size-6 rounded-full" />
										<span className="author">{escapeHtml(testimonial.author)}</span>
									</motion.div>
								)
						)}
					</AnimatePresence>
				</div>
				<Link target="_blank" href={'https://warpcast.com/~/channel/intelligent'}>
					<div className="flex space-x-2 items-center justify-center">
						<span className="text-black/60 hover:text-black text-sm"> Join /intelligent </span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 text-black">
							<path
								fillRule="evenodd"
								d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</Link>
			</div>
		</div>
	);
}
