import { useState } from 'react';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/transactions.css';

function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const { isAdmin } = useAuth();

  const handleTransactionAdded = () => {
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>Transactions</h2>
        {isAdmin && (
          <button 
            className="add-transaction-btn"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus"></i> New Transaction
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowForm(false)}
            >
              &times;
            </button>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
          </div>
        </div>
      )}

      <TransactionList refreshTrigger={refreshList} />
    </div>
  );
}

export default TransactionsPage;
