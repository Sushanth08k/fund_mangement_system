import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';

export const logTransactionAction = async (transactionId, action, details) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    const logsCollection = collection(db, 'transactionLogs');
    await addDoc(logsCollection, {
      transactionId,
      userId: user.uid,
      userEmail: user.email,
      action,
      details,
      timestamp: Timestamp.fromDate(new Date())
    });

    return true;
  } catch (error) {
    console.error('Error logging transaction action:', error);
    throw error;
  }
};