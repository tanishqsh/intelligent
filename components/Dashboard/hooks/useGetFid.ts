import { usePrivy } from '@privy-io/react-auth';

export default function useGetFid({ overrideFid }: { overrideFid?: string }) {
	const { user } = usePrivy();
	const fid = overrideFid || user?.farcaster?.fid?.toString() || '';
	return { fid };
}
