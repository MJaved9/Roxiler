const axios = require('axios');
const Transaction = require('../models/Transaction');

const getMonth = (date) => new Date(date).getMonth() + 1;

exports.initDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  const regex = new RegExp(search, 'i');
  const query = {
    ...(month && { dateOfSale: { $month: parseInt(month) } }),
    ...(search && { $or: [{ title: regex }, { description: regex }, { price: regex }] }),
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $month: parseInt(month) } } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $month: parseInt(month) },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $month: parseInt(month) },
      sold: false
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];

  try {
    const barChartData = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $month: parseInt(month) },
          price: { $gte: min, $lt: max }
        });
        return { range, count };
      })
    );

    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $month: parseInt(month) } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await Transaction.find({ dateOfSale: { $month: parseInt(month) } });
    const statistics = await Transaction.aggregate([
      { $match: { dateOfSale: { $month: parseInt(month) } } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $month: parseInt(month) },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $month: parseInt(month) },
      sold: false
    });

    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $month: parseInt(month) },
          price: { $gte: min, $lt: max }
        });
        return { range, count };
      })
    );

    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $month: parseInt(month) } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      transactions,
      statistics: {
        totalSaleAmount: statistics[0]?.totalAmount || 0,
        totalSoldItems,
        totalNotSoldItems,
      },
      barChart: barChartData,
      pieChart: pieChartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
