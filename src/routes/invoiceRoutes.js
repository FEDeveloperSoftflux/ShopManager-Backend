import express from 'express';
import { invoiceController } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/', invoiceController.getAllInvoices);
router.post('/', invoiceController.createInvoice);
router.delete('/:invoiceNo', invoiceController.deleteInvoice);
router.put('/:invoiceNo/payment', invoiceController.addLoanPayment);

export default router;
