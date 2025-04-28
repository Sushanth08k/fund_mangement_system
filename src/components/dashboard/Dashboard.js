import React, { useState, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import RecentTransactions from './RecentTransactions';
import MonthlyChart from './MonthlyChart';
import { getDashboardStats } from '../../services/analyticsService';
import { getRecentTransactions } from '../../services/transactionService';
import '../../styles/dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalFunds: 0,
    activeTransactions: 0,
    pendingTransactions: 0,
    totalBeneficiaries: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const statsData = await getDashboardStats();
        const transactions = await getRecentTransactions(5);
        
        setStats(statsData);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="summary-cards">
        <SummaryCard 
          title="Total Funds" 
          value={`₹${stats.totalFunds.toLocaleString()}`} 
          icon="fa-money-bill-wave" 
          color="blue" 
        />
        <SummaryCard 
          title="Active Transactions" 
          value={stats.activeTransactions} 
          icon="fa-exchange-alt" 
          color="green" 
        />
        <SummaryCard 
          title="Pending Transactions" 
          value={stats.pendingTransactions} 
          icon="fa-clock" 
          color="orange" 
        />
        <SummaryCard 
          title="Total Beneficiaries" 
          value={stats.totalBeneficiaries} 
          icon="fa-users" 
          color="purple" 
        />
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-col">
          <MonthlyChart />
        </div>
        <div className="dashboard-col">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
