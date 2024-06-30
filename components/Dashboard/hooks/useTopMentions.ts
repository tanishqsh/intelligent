import { useEffect, useState, useMemo, useCallback } from 'react';
import Duration from '../Overview/Duration';
import firestore from '@/lib/firebase/firestore';
import { collection, onSnapshot } from '@firebase/firestore';

const useTopMentions = (fid: string, duration: string) => {
	const [data, setData] = useState<any[]>([]);

	const collectionName = useMemo(() => {
		switch (duration) {
			case Duration.DAYS_180:
				return 'top_mentions_180d';
			case Duration.DAYS_30:
				return 'top_mentions_30d';
			case Duration.DAYS_7:
				return 'top_mentions_7d';
			default:
				return 'top_mentions_24h';
		}
	}, [duration]);

	useEffect(() => {
		if (!fid || !duration) return;

		const collectionRef = collection(firestore, 'user_stats', fid, collectionName);

		const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setData(docs);
		});

		return () => {
			unsubscribe();
		};
	}, [fid, duration, collectionName]);

	return useMemo(() => ({ data }), [data]);
};

export default useTopMentions;
