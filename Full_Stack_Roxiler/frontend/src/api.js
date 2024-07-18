import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchTransactions = (month, search, page, perPage) => {
  return axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, search, page, perPage },
  });
};

export const fetchStatistics = (month) => {
  return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChartData = (month) => {
  return axios.get(`${API_BASE_URL}/barchart`, { params: { month } });
};

export const fetchPieChartData = (month) => {
  return axios.get(`${API_BASE_URL}/piechart`, { params: { month } });
};
