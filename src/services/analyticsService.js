import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy,
    Timestamp 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Get dashboard stats
  export const getDashboardStats = async () => {
    try {
      const transactionsCollection = collection(db, 'transactions');
      const transactionsSnapshot = await getDocs(transactionsCollection);
      
      const transactions = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const totalFunds = transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
      const activeTransactions = transactions.filter(t => t.status === 'active').length;
      const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
      
      // Get unique beneficiaries
      const beneficiarySet = new Set();
      transactions.forEach(t => {
        if (t.beneficiaryName) {
          beneficiarySet.add(t.beneficiaryName);
        }
      });
      
      return {
        totalFunds,
        activeTransactions,
        pendingTransactions,
        totalBeneficiaries: beneficiarySet.size
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  };
  
  // Get monthly fund data for charts
  export const getMonthlyFundData = async () => {
    try {
      const transactionsCollection = collection(db, 'transactions');
      const transactionsSnapshot = await getDocs(transactionsCollection);
      
      const transactions = transactionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));
      
      // Get last 6 months
      const months = [];
      const allocated = [];
      const utilized = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthLabel = `${monthName} ${year}`;
        
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthTransactions = transactions.filter(t => 
          t.createdAt >= monthStart && t.createdAt <= monthEnd
        );
        
        const monthAllocated = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const monthUtilized = monthTransactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        months.push(monthLabel);
        allocated.push(monthAllocated);
        utilized.push(monthUtilized);
      }
      
      return { months, allocated, utilized };
    } catch (error) {
      console.error('Error getting monthly fund data:', error);
      throw error;
    }
  };
  
  // Get sector analytics
  export const getSectorAnalytics = async (timeRange) => {
    try {
      // Define time range
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'year':
        default:
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      // Get all sectors
      const sectorsCollection = collection(db, 'sectors');
      const sectorsSnapshot = await getDocs(sectorsCollection);
      const sectors = sectorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get transactions in the time range
      const transactionsCollection = collection(db, 'transactions');
      const q = query(
        transactionsCollection,
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(now))
      );
      const transactionsSnapshot = await getDocs(q);
      const transactions = transactionsSnapshot.docs.map(doc => ({
        ...doc.data()
      }));
      
      // Calculate amounts by sector
      const sectorAmounts = {};
      sectors.forEach(sector => {
        sectorAmounts[sector.id] = 0;
      });
      
      transactions.forEach(transaction => {
        if (transaction.sectorId && sectorAmounts[transaction.sectorId] !== undefined) {
          sectorAmounts[transaction.sectorId] += transaction.amount || 0;
        }
      });
      
      // Format data for chart
      const sectorNames = sectors.map(sector => sector.name);
      const amounts = sectors.map(sector => sectorAmounts[sector.id]);
      
      return {
        sectors: sectorNames,
        amounts
      };
    } catch (error) {
      console.error('Error getting sector analytics:', error);
      throw error;
    }
  };
  
  // Get state/district analytics
  export const getStateDistrictAnalytics = async (timeRange) => {
    try {
      // Define time range
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case 'year':
        default:
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      // Get all states
      const statesCollection = collection(db, 'states');
      const statesSnapshot = await getDocs(statesCollection);
      const states = statesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get transactions in the time range
      const transactionsCollection = collection(db, 'transactions');
      const q = query(
        transactionsCollection,
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(now))
      );
      const transactionsSnapshot = await getDocs(q);
      const transactions = transactionsSnapshot.docs.map(doc => ({
        ...doc.data()
      }));
      
      // Calculate amounts by state
      const stateAmounts = {};
      states.forEach(state => {
        stateAmounts[state.id] = 0;
      });
      
      transactions.forEach(transaction => {
        if (transaction.stateId && stateAmounts[transaction.stateId] !== undefined) {
          stateAmounts[transaction.stateId] += transaction.amount || 0;
        }
      });
      
      // Format data for chart
      const stateNames = states.map(state => state.name);
      const amounts = states.map(state => stateAmounts[state.id]);
      
      return {
        states: stateNames,
        amounts
      };
    } catch (error) {
      console.error('Error getting state/district analytics:', error);
      throw error;
    }
  };
  
  // Get trend analysis data
  export const getTrendAnalysisData = async (timeRange) => {
    try {
      // Define time range and interval
      const now = new Date();
      let startDate;
      let interval;
      
      switch (timeRange) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          interval = 'day';
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          interval = 'week';
          break;
        case 'year':
        default:
          startDate = new Date(now.getFullYear(), 0, 1);
          interval = 'month';
          break;
      }
      
      // Get transactions in the time range
      const transactionsCollection = collection(db, 'transactions');
      const q = query(
        transactionsCollection,
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(now)),
        orderBy('createdAt', 'asc')
      );
      const transactionsSnapshot = await getDocs(q);
      const transactions = transactionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      }));
      
      // Process data based on interval
      let labels = [];
      let data = [];
      
      if (interval === 'day') {
        // Daily data for month view
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
          const date = new Date(now.getFullYear(), now.getMonth(), i);
          labels.push(i.toString());
          
          const dayTransactions = transactions.filter(t => 
            t.createdAt.getDate() === i && 
            t.createdAt.getMonth() === date.getMonth() && 
            t.createdAt.getFullYear() === date.getFullYear()
          );
          
          const dayTotal = dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
          data.push(dayTotal);
        }
      } else if (interval === 'week') {
        // Weekly data for quarter view
        const weeks = 13; // ~13 weeks in a quarter
        
        for (let i = 0; i < weeks; i++) {
          const weekStart = new Date(startDate);
          weekStart.setDate(weekStart.getDate() + (i * 7));
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          if (weekEnd > now) {
            break;
          }
          
          const weekLabel = `Week ${i + 1}`;
          labels.push(weekLabel);
          
          const weekTransactions = transactions.filter(t => 
            t.createdAt >= weekStart && t.createdAt <= weekEnd
          );
          
          const weekTotal = weekTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
          data.push(weekTotal);
        }
      } else {
        // Monthly data for year view
        for (let i = 0; i < 12; i++) {
          const monthDate = new Date(now.getFullYear(), i, 1);
          const monthName = monthDate.toLocaleString('default', { month: 'short' });
          
          if (monthDate < startDate) {
            continue;
          }
          
          if (monthDate > now) {
            break;
          }
          
          labels.push(monthName);
          
          const monthTransactions = transactions.filter(t => 
            t.createdAt.getMonth() === i && 
            t.createdAt.getFullYear() === now.getFullYear()
          );
          
          const monthTotal = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
          data.push(monthTotal);
        }
      }
      
      return { labels, data };
    } catch (error) {
      console.error('Error getting trend analysis data:', error);
      throw error;
    }
  };
  
  // Get states for dropdown
  export const getStates = async () => {
    try {
      const statesCollection = collection(db, 'states');
      const statesSnapshot = await getDocs(statesCollection);
      
      return statesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting states:', error);
      throw error;
    }
  };
  
  // Get districts for dropdown
  export const getDistricts = async (stateId) => {
    try {
      const districtsCollection = collection(db, 'districts');
      const q = query(districtsCollection, where('stateId', '==', stateId));
      const districtsSnapshot = await getDocs(q);
      
      return districtsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting districts:', error);
      throw error;
    }
  };
  
  // Get sectors for dropdown
  export const getSectors = async () => {
    try {
      const sectorsCollection = collection(db, 'sectors');
      const sectorsSnapshot = await getDocs(sectorsCollection);
      
      return sectorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting sectors:', error);
      throw error;
    }
  };
  