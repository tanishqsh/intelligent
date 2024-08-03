import ExplainUI from '@/components/ui/ExplainUI/ExplainUI';
import Image from 'next/image';

export default function MoxieEarnedFlair({ moxieEarned }: { moxieEarned: number }) {
	return (
		<div className="font-medium flex-none bg-[#A577FF]/10 inline-flex items-center space-x-2 rounded-md px-2 py-1">
			<ExplainUI text="Total Moxie Earned">
				<div className="flex space-x-2">
					<p className="text-xs text-[rgb(168,125,255)]">{moxieEarned.toFixed(2)}</p>
					<Image width={24} height={24} className="size-4" src="/moxie.svg" alt="Moxie" />
				</div>
			</ExplainUI>
		</div>
	);
}
