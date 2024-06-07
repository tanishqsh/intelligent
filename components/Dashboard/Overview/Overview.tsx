import DurationSelector from './DurationSelector';
import FollowersGained from './FollowersGained';
import PlatformMentions from './PlatformMentions';
import TotalEngagement from './TotalEngagement';

export default function Overview() {
	return (
		<>
			<div className="flex justify-between items-end">
				<div>
					<h3 className="text-sm text-neutral-400">Overview</h3>
				</div>
				<DurationSelector />
			</div>
			<div className="flex items-center space-x-4 pt-2">
				<FollowersGained />
				<PlatformMentions />
				<TotalEngagement />
			</div>
		</>
	);
}
