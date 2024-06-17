import DurationSelector from './DurationSelector';
import FollowersGained from './FollowersGained';
import PlatformMentions from './PlatformMentions';
import TotalEngagement from './TotalEngagement';

export default function Overview() {
	return (
		<>
			<div className="flex justify-between items-end px-4 md:px-0">
				<div>
					<h3 className="text-sm text-neutral-400">Overview</h3>
				</div>
				<DurationSelector />
			</div>
			<div className="flex w-full overflow-scroll no-scrollbar items-center space-x-4 pt-2">
				<div className="pl-4 md:pl-0 md:w-full">
					<FollowersGained />
				</div>
				<div className="md:w-full">
					<PlatformMentions />
				</div>
				<div className="pr-4 md:pr-0 md:w-full">
					<TotalEngagement />
				</div>
			</div>
		</>
	);
}
