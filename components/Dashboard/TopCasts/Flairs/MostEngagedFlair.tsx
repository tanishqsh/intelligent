import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';

const MostEngagedFlair = () => {
	return (
		<div className="font-medium flex-none text-yellow-600 inline-flex items-center space-x-2 rounded-md bg-yellow-500/5 px-2 py-1">
			<ExplainUI text="Most engaged cast in selected time period">
				<div className="flex space-x-2">
					<p className="text-xs">Most engaged</p>
					<svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6.75 16.75L4.75 6.75L9 9.25L12 4.75L15 9.25L19.25 6.75L17.25 16.75H6.75Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						></path>
						<path
							d="M17.25 16.75H6.75C5.64543 16.75 4.75 17.6454 4.75 18.75V19.25H19.25V18.75C19.25 17.6454 18.3546 16.75 17.25 16.75Z"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						></path>
					</svg>
				</div>
			</ExplainUI>
		</div>
	);
};

export default MostEngagedFlair;
