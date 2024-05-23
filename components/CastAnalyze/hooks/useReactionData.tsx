import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import firestore from '@/lib/firebase/firestore';

interface FirestoreData {
	id: string;
	reactionType?: 'like' | 'recast';
	[key: string]: any;
}

const useReactionData = (listenerActive: boolean, cast: any, isLoaded: boolean) => {
	const [likes, setLikes] = useState<any[]>([]);
	const [recasts, setRecasts] = useState<any[]>([]);

	useEffect(() => {
		let unsubscribeReactions: (() => void) | undefined;

		if (listenerActive && cast && isLoaded) {
			const reactionsCollectionPath = `casts/${cast.hash}/reactions`;
			const reactionsCollection = collection(firestore, reactionsCollectionPath);
			unsubscribeReactions = onSnapshot(reactionsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
				const newLikes: FirestoreData[] = [];
				const newRecasts: FirestoreData[] = [];

				snapshot.docs.forEach((doc) => {
					const data: FirestoreData = {
						id: doc.id,
						...doc.data(),
					};

					if (data.reactionType === 'like') {
						newLikes.push(data);
					} else if (data.reactionType === 'recast') {
						newRecasts.push(data);
					}
				});

				setLikes(newLikes);
				setRecasts(newRecasts);
			});
		}

		return () => {
			if (unsubscribeReactions) unsubscribeReactions();
		};
	}, [listenerActive, cast, isLoaded]);

	return { likes, recasts };
};

export default useReactionData;
