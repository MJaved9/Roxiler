const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/init', transactionController.initDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/barchart', transactionController.getBarChart);
router.get('/piechart', transactionController.getPieChart);
router.get('/combined', transactionController.getCombinedData);

module.exports = router;
