import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { logTransactionAction } from './loggingService';

// Helper function to check if current user is admin
const checkAdminAccess = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists() || userDoc.data().role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }
};

// Create new transaction (admin only)
export const createTransaction = async (transactionData) => {
  try {
    await checkAdminAccess();

    // Get references to related entities
    const stateRef = doc(db, 'states', transactionData.stateId);
    const sectorRef = doc(db, 'sectors', transactionData.sectorId);
    
    // Get state and sector data for display names
    const stateDoc = await getDoc(stateRef);
    if (!stateDoc.exists()) {
      throw new Error('Selected state not found');
    }

    const sectorDoc = await getDoc(sectorRef);
    if (!sectorDoc.exists()) {
      throw new Error('Selected sector not found');
    }
    
    let districtName = null;
    let districtRef = null;
    if (transactionData.districtId) {
      districtRef = doc(db, 'districts', transactionData.districtId);
      const districtDoc = await getDoc(districtRef);
      if (!districtDoc.exists()) {
        throw new Error('Selected district not found');
      }
      districtName = districtDoc.data().name;
    }
    
    // Create the transaction
    const transactionsCollection = collection(db, 'transactions');
    const docRef = await addDoc(transactionsCollection, {
      ...transactionData,
      stateName: stateDoc.data().name,
      districtName,
      sectorName: sectorDoc.data().name,
      createdAt: Timestamp.fromDate(new Date()),
      status: 'pending'
    });
    
    // Update allocated funds in state
    await updateDoc(stateRef, {
      allocatedFunds: increment(transactionData.amount)
    });
    
    // Update allocated funds in district if specified
    if (districtRef) {
      await updateDoc(districtRef, {
        allocatedFunds: increment(transactionData.amount)
      });
    }
    
    // Update allocated funds in sector
    await updateDoc(sectorRef, {
      allocatedFunds: increment(transactionData.amount)
    });

    // Log the transaction creation
    await logTransactionAction(docRef.id, 'create', {
      amount: transactionData.amount,
      state: stateDoc.data().name,
      district: districtName,
      sector: sectorDoc.data().name
    });
    
    // Return true to indicate success
    return true;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Get all transactions (read-only, available to all authenticated users)
export const getTransactions = async () => {
  try {
    const transactionsCollection = collection(db, 'transactions');
    const q = query(transactionsCollection, orderBy('createdAt', 'desc'));
    const transactionsSnapshot = await getDocs(q);
    
    return transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// Get recent transactions (read-only, available to all authenticated users)
export const getRecentTransactions = async (limitCount = 5) => {
  try {
    const transactionsCollection = collection(db, 'transactions');
    const q = query(
      transactionsCollection, 
      orderBy('createdAt', 'desc'), 
      limit(limitCount)
    );
    const transactionsSnapshot = await getDocs(q);
    
    return transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    throw error;
  }
};

// Get transaction by ID (read-only, available to all authenticated users)
export const getTransactionById = async (id) => {
  try {
    const transactionDoc = doc(db, 'transactions', id);
    const transactionSnapshot = await getDoc(transactionDoc);
    
    if (transactionSnapshot.exists()) {
      const data = transactionSnapshot.data();
      return {
        id: transactionSnapshot.id,
        ...data,
        createdAt: data.createdAt.toDate()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting transaction by ID:', error);
    throw error;
  }
};

// Update transaction status (admin only)
export const updateTransactionStatus = async (id, status) => {
  try {
    await checkAdminAccess();

    const transactionDoc = doc(db, 'transactions', id);
    const transactionSnapshot = await getDoc(transactionDoc);
    
    if (!transactionSnapshot.exists()) {
      throw new Error('Transaction not found');
    }
    
    const transactionData = transactionSnapshot.data();
    
    // Update transaction status
    await updateDoc(transactionDoc, { 
      status,
      updatedAt: Timestamp.fromDate(new Date())
    });

    // Log the status update
    await logTransactionAction(id, 'status_update', {
      oldStatus: transactionData.status,
      newStatus: status,
      amount: transactionData.amount
    });
    
    // If status is completed, update utilized funds
    if (status === 'completed') {
      // Update state utilized funds
      const stateRef = doc(db, 'states', transactionData.stateId);
      await updateDoc(stateRef, {
        utilizedFunds: increment(transactionData.amount)
      });
      
      // Update district utilized funds if specified
      if (transactionData.districtId) {
        const districtRef = doc(db, 'districts', transactionData.districtId);
        await updateDoc(districtRef, {
          utilizedFunds: increment(transactionData.amount)
        });
      }
      
      // Update sector utilized funds
      const sectorRef = doc(db, 'sectors', transactionData.sectorId);
      await updateDoc(sectorRef, {
        utilizedFunds: increment(transactionData.amount)
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

// Get transactions by sector (read-only, available to all authenticated users)
export const getTransactionsBySector = async (sectorId) => {
  try {
    const transactionsCollection = collection(db, 'transactions');
    const q = query(
      transactionsCollection, 
      where("sectorId", "==", sectorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  } catch (error) {
    console.error('Error getting transactions by sector:', error);
    throw error;
  }
};

// Get transactions by state (read-only, available to all authenticated users)
export const getTransactionsByState = async (stateId) => {
  try {
    const transactionsCollection = collection(db, 'transactions');
    const q = query(
      transactionsCollection, 
      where("stateId", "==", stateId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  } catch (error) {
    console.error('Error getting transactions by state:', error);
    throw error;
  }
};
