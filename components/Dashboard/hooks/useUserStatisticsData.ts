import { useState, useEffect, useMemo } from 'react';
import { collection, doc, onSnapshot, DocumentData } from 'firebase/firestore';
import firestore from '@/lib/firebase/firestore';

const useUserStatisticsData = (fid: string, isReady: boolean) => {
	console.log(`UseUSData called at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`);
	const [userStatistics, setUserStatistics] = useState<DocumentData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let unsubscribeUserStats: (() => void) | undefined;

		if (!fid) {
			setError('FID is missing');
			return;
		}

		if (fid && isReady) {
			const userStatDoc = doc(collection(firestore, 'user_stats'), fid);

			unsubscribeUserStats = onSnapshot(userStatDoc, (docSnapshot) => {
				if (docSnapshot.exists()) {
					setUserStatistics({ id: docSnapshot.id, ...docSnapshot.data() });
				} else {
					setError('Document does not exist');
					setUserStatistics(null);
				}
			});
		}

		return () => {
			if (unsubscribeUserStats) unsubscribeUserStats();
		};
	}, [fid, isReady]);

	return useMemo(() => ({ userStatistics, error }), [userStatistics, error]);
};

export default useUserStatisticsData;
