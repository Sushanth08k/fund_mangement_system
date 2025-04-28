import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const setUserAsAdmin = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is logged in');
    }

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      role: 'admin',
      email: user.email,
      displayName: user.displayName,
      updatedAt: new Date()
    }, { merge: true });

    console.log('Successfully set user as admin');
    return true;
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
};