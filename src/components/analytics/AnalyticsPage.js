import React, { useState } from 'react';
import SectorChart from './SectorChart';
import StateDistrictChart from './StateDistrictChart';
import TrendAnalysis from './TrendAnalysis';
import '../../styles/analytics.css';

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('year');

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics</h2>
        
        <div className="time-range-selector">
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            This Month
          </button>
          <button 
            className={timeRange === 'quarter' ? 'active' : ''}
            onClick={() => setTimeRange('quarter')}
          >
            This Quarter
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''}
            onClick={() => setTimeRange('year')}
          >
            This Year
          </button>
        </div>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <SectorChart timeRange={timeRange} />
        </div>
        
        <div className="analytics-card">
          <StateDistrictChart timeRange={timeRange} />
        </div>
        
        <div className="analytics-card full-width">
          <TrendAnalysis timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
