import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getTrendAnalysisData } from '../../services/analyticsService';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TrendAnalysis({ timeRange }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendData() {
      try {
        setLoading(true);
        const data = await getTrendAnalysisData(timeRange);
        
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Fund Allocation Trend',
              data: data.data,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.4,
              fill: true
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching trend data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendData();
  }, [timeRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fund Allocation Trend Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading trend data...</div>;
  }

  return (
    <div className="chart-container">
      <h3>Fund Allocation Trend</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TrendAnalysis;
