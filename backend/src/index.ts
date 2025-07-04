import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Product from "./models/Product"

const app = express();
app.use(express.json());
app.use(cors());

const CONNECT_URL = process.env.CONNECT_URL || '';
const PORT = process.env.PORT || 3500;

const connectDB = async () => {
  try {
    await mongoose.connect(CONNECT_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); 
    res.json(products); 
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).send('Server error');
  }
});

app.get('/health', (req, res) => {
  res.send('OK');
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
