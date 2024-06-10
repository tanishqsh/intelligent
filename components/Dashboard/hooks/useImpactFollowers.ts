import { useEffect, useState, useMemo, useCallback } from 'react';
import Duration from '../Overview/Duration';
import firestore from '@/lib/firebase/firestore';
import { collection, onSnapshot } from '@firebase/firestore';

const useImpactFollowers = (fid: string, duration: string) => {
	const [impactFollowers, setImpactFollowers] = useState<any[]>([]);

	const collectionName = useMemo(() => {
		switch (duration) {
			case Duration.DAYS_180:
				return 'impact_followers_180d';
			case Duration.DAYS_30:
				return 'impact_followers_30d';
			case Duration.DAYS_7:
				return 'impact_followers_7d';
			default:
				return 'impact_followers_24h';
		}
	}, [duration]);

	useEffect(() => {
		if (!fid || !duration) return;

		const collectionRef = collection(firestore, 'user_stats', fid, collectionName);

		const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setImpactFollowers(docs);
		});

		return () => {
			unsubscribe();
		};
	}, [fid, duration, collectionName]);

	return useMemo(() => ({ impactFollowers }), [impactFollowers]);
};

export default useImpactFollowers;
