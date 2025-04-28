import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { getSectorAnalytics } from '../../services/analyticsService';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

function SectorChart({ timeRange }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSectorData() {
      try {
        setLoading(true);
        const data = await getSectorAnalytics(timeRange);
        
        // Generate colors for each sector
        const backgroundColors = data.sectors.map((_, index) => {
          const hue = (index * 137) % 360; // Golden angle approximation for good distribution
          return `hsla(${hue}, 70%, 60%, 0.8)`;
        });
        
        setChartData({
          labels: data.sectors,
          datasets: [
            {
              data: data.amounts,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching sector data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSectorData();
  }, [timeRange]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Fund Allocation by Sector'
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading sector data...</div>;
  }

  return (
    <div className="chart-container">
      <h3>Fund Allocation by Sector</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default SectorChart;
