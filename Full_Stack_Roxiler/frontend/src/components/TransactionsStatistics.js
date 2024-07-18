import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../api';

const TransactionsStatistics = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    loadStatistics();
  }, [selectedMonth]);

  const loadStatistics = async () => {
    try {
      const response = await fetchStatistics(selectedMonth);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div className="statistics">
      <div className="stat-box">
        <h3>Total Sale Amount</h3>
        <p>{statistics.totalSaleAmount}</p>
      </div>
      <div className="stat-box">
        <h3>Total Sold Items</h3>
        <p>{statistics.totalSoldItems}</p>
      </div>
      <div className="stat-box">
        <h3>Total Not Sold Items</h3>
        <p>{statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default TransactionsStatistics;
