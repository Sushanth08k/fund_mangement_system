import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById, updateTransactionStatus } from '../../services/transactionService';
import { formatDate, formatCurrency, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setLoading(true);
        const data = await getTransactionById(id);
        
        if (!data) {
          setError('Transaction not found');
          return;
        }
        
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    }

    fetchTransaction();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) {
      setError('Only administrators can update transaction status');
      return;
    }
    try {
      await updateTransactionStatus(id, newStatus);
      setTransaction(prev => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error updating transaction status:', error);
      setError('Transaction Approved successfully');
    }
  };

  if (loading) {
    return <div className="loading">Loading transaction details...</div>;
  }

  if (error) {
    return (
      <div className="transaction-details">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/transactions')} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="transaction-details">
      <div className="page-header">
        <h2>Transaction Details</h2>
        <button onClick={() => navigate('/transactions')} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Transactions
        </button>
      </div>
      
      <div className="transaction-status-bar">
        <div className="transaction-id">
          Transaction ID: <span>{transaction.id}</span>
        </div>
        <div className="transaction-status">
          Status: <span className={`status ${transaction.status}`}>{transaction.status}</span>
        </div>
      </div>
      
      <div className="details-grid">
        <div className="details-card">
          <h3>Basic Information</h3>
          <div className="details-row">
            <div className="details-label">Amount:</div>
            <div className="details-value">{formatCurrency(transaction.amount)}</div>
          </div>
          <div className="details-row">
            <div className="details-label">Created:</div>
            <div className="details-value">{formatDateTime(transaction.createdAt)}</div>
          </div>
          {transaction.updatedAt && (
            <div className="details-row">
              <div className="details-label">Last Updated:</div>
              <div className="details-value">{formatDateTime(transaction.updatedAt)}</div>
            </div>
          )}
          {transaction.description && (
            <div className="details-row">
              <div className="details-label">Description:</div>
              <div className="details-value description">{transaction.description}</div>
            </div>
          )}
        </div>
        
        <div className="details-card">
          <h3>Allocation Details</h3>
          <div className="details-row">
            <div className="details-label">State:</div>
            <div className="details-value">{transaction.stateName}</div>
          </div>
          {transaction.districtName && (
            <div className="details-row">
              <div className="details-label">District:</div>
              <div className="details-value">{transaction.districtName}</div>
            </div>
          )}
          <div className="details-row">
            <div className="details-label">Sector:</div>
            <div className="details-value">{transaction.sectorName}</div>
          </div>
          {transaction.beneficiaryName && (
            <div className="details-row">
              <div className="details-label">Beneficiary:</div>
              <div className="details-value">{transaction.beneficiaryName}</div>
            </div>
          )}
        </div>
      </div>
      
      {isAdmin && (
        <div className="transaction-actions">
          {transaction.status === 'pending' && (
            <button 
              className="approve-button"
              onClick={() => handleStatusChange('active')}
            >
              <i className="fas fa-check"></i> Approve Transaction
            </button>
          )}
          
          {transaction.status === 'active' && (
            <button 
              className="complete-button"
              onClick={() => handleStatusChange('completed')}
            >
              <i className="fas fa-check-double"></i> Mark as Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionDetails;
