import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { itemController } from './controllers/itemController.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect DB
connectDatabase();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Shop Manager Backend is running successfully!",
    status: "OK",
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);

// Bulk items route
app.put('/api/items-bulk/prices', itemController.updateBulkPrices);

export default app;
