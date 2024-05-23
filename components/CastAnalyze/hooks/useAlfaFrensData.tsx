import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import firestore from '@/lib/firebase/firestore';

const useAlfaFrensData = (listenerActive: boolean, fid: string, isLoaded: boolean) => {
	const [members, setMembers] = useState<any[]>([]);

	useEffect(() => {
		let unsubscribeMembers: (() => void) | undefined;

		if (listenerActive && fid && isLoaded) {
			const membersCollectionPath = `users/${fid}/alfafrensMembers`;
			const q = query(collection(firestore, membersCollectionPath));

			unsubscribeMembers = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
				const newData = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setMembers(newData);
			});
		}

		return () => {
			if (unsubscribeMembers) unsubscribeMembers();
		};
	}, [listenerActive, fid, isLoaded]);

	return { members };
};

export default useAlfaFrensData;
