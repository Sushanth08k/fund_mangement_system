import React from 'react';

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className={`summary-card ${color}`}>
      <div className="card-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
