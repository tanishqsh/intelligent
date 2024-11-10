import { useEffect, useState, useMemo } from 'react';
import firestore from '@/lib/firebase/firestore';
import { collection, onSnapshot } from '@firebase/firestore';
import { usePrivy } from '@privy-io/react-auth';
import useGetFid from '@/components/Dashboard/hooks/useGetFid';

const useAlfafrensMembers = () => {
	const { ready, user } = usePrivy();
	const { fid } = useGetFid({});

	const [alfafrensMembers, setAlfafrensMembers] = useState<any[]>([]);

	useEffect(() => {
		if (!fid) return;

		const collectionRef = collection(firestore, 'users', fid.toString(), 'alfafrensMembers');

		const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setAlfafrensMembers(docs);
		});

		return () => {
			unsubscribe();
		};
	}, [fid]);

	return useMemo(() => ({ alfafrensMembers }), [alfafrensMembers]);
};

export default useAlfafrensMembers;
