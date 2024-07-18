import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchBarChartData } from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionsBarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    loadBarChartData();
  }, [selectedMonth]);

  const loadBarChartData = async () => {
    try {
      const response = await fetchBarChartData(selectedMonth);
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const data = {
    labels: barChartData.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: barChartData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price Range Bar Chart',
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Price Range',
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Number of Items',
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Price Range Bar Chart</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TransactionsBarChart;
