const LinkSVG = ({ className }: { className?: string }) => (
	<svg className={className} fill="none" viewBox="0 0 24 24">
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M16.75 13.25L18 12C19.6569 10.3431 19.6569 7.65685 18 6V6C16.3431 4.34315 13.6569 4.34315 12 6L10.75 7.25"
		></path>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			d="M7.25 10.75L6 12C4.34315 13.6569 4.34315 16.3431 6 18V18C7.65685 19.6569 10.3431 19.6569 12 18L13.25 16.75"
		></path>
		<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.25 9.75L9.75 14.25"></path>
	</svg>
);

export default LinkSVG;
