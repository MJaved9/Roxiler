import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../api';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, search, page]);

  const loadTransactions = async () => {
    try {
      const response = await fetchTransactions(selectedMonth, search, page, perPage);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
        <button onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
