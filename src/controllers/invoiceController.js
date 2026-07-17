import { InvoiceModel } from '../models/invoiceModel.js';
import { ItemModel } from '../models/itemModel.js';

export const invoiceController = {
  async getAllInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.find().sort({ createdAt: -1 });
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createInvoice(req, res) {
    const { invoiceNo, dateTime, units, subtotal, discount, tax, total, paymentMethod, cashier, items, loanDetails } = req.body;
    try {
      const newInvoice = new InvoiceModel({
        invoiceNo,
        dateTime,
        units,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        cashier,
        items,
        loanDetails
      });
      await newInvoice.save();

      // Deduct stock quantity in MongoDB
      if (items && Array.isArray(items)) {
        for (const it of items) {
          await ItemModel.findOneAndUpdate(
            { id: it.id },
            { $inc: { stock: -Number(it.quantity || 1) } }
          );
        }
      }

      res.status(201).json({ message: 'Invoice saved successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addLoanPayment(req, res) {
    const { invoiceNo } = req.params;
    const { amountPaid, date } = req.body;
    try {
      const invoice = await InvoiceModel.findOne({ invoiceNo });
      if (!invoice || !invoice.loanDetails) {
        return res.status(404).json({ error: 'Invoice or loan details not found' });
      }

      const paymentAmount = Number(amountPaid);
      const newPayments = [
        ...(invoice.loanDetails.payments || []),
        { date, amount: paymentAmount }
      ];

      const totalPaid = Number(invoice.loanDetails.amountPaid) + paymentAmount;
      const remaining = Math.max(0, Number(invoice.loanDetails.outstandingAmount) - paymentAmount);
      
      let newStatus = 'Unpaid';
      if (remaining === 0) {
        newStatus = 'Paid';
      } else if (totalPaid > 0) {
        newStatus = 'Partially Paid';
      }

      invoice.loanDetails.amountPaid = totalPaid;
      invoice.loanDetails.outstandingAmount = remaining;
      invoice.loanDetails.status = newStatus;
      invoice.loanDetails.payments = newPayments;

      await invoice.save();

      res.json({ message: 'Loan payment added successfully', updatedLoanDetails: invoice.loanDetails });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
