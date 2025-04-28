import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions, updateTransactionStatus } from '../../services/transactionService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

function TransactionList({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [refreshTrigger]);

  const handleStatusChange = async (id, newStatus) => {
    if (!isAdmin) {
      return;
    }
    try {
      await updateTransactionStatus(id, newStatus);
      setTransactions(transactions.map(transaction => 
        transaction.id === id ? { ...transaction, status: newStatus } : transaction
      ));
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.status === filter;
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.beneficiaryName && 
        transaction.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.description && 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="transaction-list">
      <div className="list-controls">
        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="search">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="no-data">No transactions found</div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>State/District</th>
              <th>Sector</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>
                  <Link to={`/transactions/${transaction.id}`}>
                    {transaction.id.substring(0, 8)}...
                  </Link>
                </td>
                <td>{formatDate(transaction.createdAt)}</td>
                <td>{formatCurrency(transaction.amount)}</td>
                <td>
                  {transaction.stateName}
                  {transaction.districtName && ` / ${transaction.districtName}`}
                </td>
                <td>{transaction.sectorName}</td>
                <td>
                  <span className={`status ${transaction.status}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/transactions/${transaction.id}`} className="view-btn">
                      <i className="fas fa-eye"></i>
                    </Link>
                    
                    {isAdmin && transaction.status === 'pending' && (
                      <button 
                        className="approve-btn"
                        onClick={() => handleStatusChange(transaction.id, 'active')}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    
                    {isAdmin && transaction.status === 'active' && (
                      <button 
                        className="complete-btn"
                        onClick={() => handleStatusChange(transaction.id, 'completed')}
                      >
                        <i className="fas fa-check-double"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionList;
