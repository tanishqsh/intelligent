import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseApp from './firebase';

const firestore = getFirestore(firebaseApp);

export default firestore;
