import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getMonthlyFundData } from '../../services/analyticsService';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MonthlyChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlyData() {
      try {
        setLoading(true);
        const data = await getMonthlyFundData();
        
        setChartData({
          labels: data.months,
          datasets: [
            {
              label: 'Allocated Funds',
              data: data.allocated,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.4
            },
            {
              label: 'Utilized Funds',
              data: data.utilized,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching monthly data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlyData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Fund Allocation & Utilization'
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading chart data...</div>;
  }

  return (
    <div className="chart-container">
      <h3>Monthly Fund Analysis</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default MonthlyChart;
