import { useEffect, useState, useMemo, useCallback } from 'react';
import firestore from '@/lib/firebase/firestore';
import { collection, onSnapshot } from '@firebase/firestore';

const useImpactUnfollowers = (fid: string) => {
	const [impactUnfollowers, setImpactUnfollowers] = useState<any[]>([]);

	useEffect(() => {
		if (!fid) return;

		const collectionRef = collection(firestore, 'user_stats', fid, 'impact_unfollowers_180d');

		const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setImpactUnfollowers(docs);
		});

		return () => {
			unsubscribe();
		};
	}, [fid]);

	return useMemo(() => ({ impactUnfollowers }), [impactUnfollowers]);
};

export default useImpactUnfollowers;
