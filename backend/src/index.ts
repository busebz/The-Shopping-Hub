import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/Auth';
import productsRoutes from "./routes/Products";
import userRoutes from './routes/User';
import cartRoutes from "./routes/Cart";
import orderRoutes from "./routes/Order";
import adminRoutes from "./routes/Admin";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

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

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user/cart', cartRoutes);
app.use('/api/user/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {res.send('OK')});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
