import React, { useState } from 'react';
import Dropdown from './components/Dropdown';
import TransactionsTable from './components/TransactionsTable';
import TransactionsStatistics from './components/TransactionsStatistics';
import TransactionsBarChart from './components/TransactionsBarChart';
import './styles.css'; // Import the styles

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March

  return (
    <div className="container">
      <h1>Product Transactions Dashboard</h1>
      <Dropdown selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      <TransactionsStatistics selectedMonth={selectedMonth} />
      <TransactionsTable selectedMonth={selectedMonth} />
      <TransactionsBarChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
