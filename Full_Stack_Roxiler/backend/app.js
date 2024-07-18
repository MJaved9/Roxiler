const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB Atlas
connectDB();

app.use(express.json());

// Routes

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
