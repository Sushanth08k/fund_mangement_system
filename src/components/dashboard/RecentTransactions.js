import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';

function RecentTransactions({ transactions }) {
  return (
    <div className="recent-transactions">
      <div className="card-header">
        <h3>Recent Transactions</h3>
        <Link to="/transactions" className="view-all">View All</Link>
      </div>
      
      {transactions.length === 0 ? (
        <p className="no-data">No recent transactions found</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>
                  <Link to={`/transactions/${transaction.id}`}>
                    {transaction.id.substring(0, 8)}...
                  </Link>
                </td>
                <td>{formatDate(transaction.createdAt)}</td>
                <td>{formatCurrency(transaction.amount)}</td>
                <td>
                  <span className={`status ${transaction.status}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecentTransactions;
