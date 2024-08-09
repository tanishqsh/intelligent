import { useEffect, useState, useMemo } from 'react';
import firestore from '@/lib/firebase/firestore';
import { collection, onSnapshot } from '@firebase/firestore';

const usePlayerData = () => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		const collectionRef = collection(firestore, 'based_games');
		const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setData(docs);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return useMemo(() => ({ data }), [data]);
};

export default usePlayerData;
