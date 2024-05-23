import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import firestore from '@/lib/firebase/firestore';

const useRepliesData = (listenerActive: boolean, cast: any, isLoaded: boolean) => {
	const [replies, setReplies] = useState<any[]>([]);

	useEffect(() => {
		let unsubscribeReplies: (() => void) | undefined;

		if (listenerActive && cast && isLoaded) {
			const q = query(collection(firestore, 'replies'), where('parentHash', '==', cast.hash));

			unsubscribeReplies = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
				const newData = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setReplies(newData);
			});
		}

		return () => {
			if (unsubscribeReplies) unsubscribeReplies();
		};
	}, [listenerActive, cast, isLoaded]);

	return { replies };
};

export default useRepliesData;
