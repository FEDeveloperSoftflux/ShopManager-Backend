import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { itemController } from './controllers/itemController.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ─── Middleware ───
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// ─── Health Check ───
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Shop Manager Backend is running' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Shop Manager API is ready' });
});

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);

// Bulk item prices (separate path from item CRUD)
app.put('/api/items-bulk/prices', itemController.updateBulkPrices);

// ─── Global Error Handler ───
app.use(errorHandler);

export default app;
