import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getStateDistrictAnalytics } from '../../services/analyticsService';
import { generateChartColors } from '../../utils/helpers';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StateDistrictChart({ timeRange }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStateData() {
      try {
        setLoading(true);
        const data = await getStateDistrictAnalytics(timeRange);
        
        // Generate colors for each state
        const backgroundColors = generateChartColors(data.states.length);
        
        setChartData({
          labels: data.states,
          datasets: [
            {
              label: 'Fund Allocation by State',
              data: data.amounts,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching state data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStateData();
  }, [timeRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fund Allocation by State'
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading state data...</div>;
  }

  return (
    <div className="chart-container">
      <h3>Fund Allocation by State</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StateDistrictChart;
