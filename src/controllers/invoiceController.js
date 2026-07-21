import { InvoiceModel } from '../models/invoiceModel.js';
import { ItemModel } from '../models/itemModel.js';

export const invoiceController = {
  /**
   * GET /api/invoices
   * Returns all invoices sorted by most recent first.
   */
  async getAllInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.find().sort({ createdAt: -1 });
      res.json(invoices);
    } catch (err) {
      console.error('Get invoices error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/invoices
   * Body: full invoice object
   * Creates a new invoice and deducts stock quantities.
   */
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

      // Deduct stock for each sold item
      if (items && Array.isArray(items)) {
        for (const soldItem of items) {
          const dbItem = await ItemModel.findOne({ id: soldItem.id });
          if (dbItem) {
            const newStock = (Number(dbItem.stock) || 0) - Number(soldItem.quantity || 1);
            await ItemModel.findOneAndUpdate({ id: soldItem.id }, { stock: newStock });
          }
        }
      }

      res.status(201).json({ message: 'Invoice saved successfully' });
    } catch (err) {
      console.error('Create invoice error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * DELETE /api/invoices/:invoiceNo
   * Deletes an invoice by its invoiceNo.
   */
  async deleteInvoice(req, res) {
    const { invoiceNo } = req.params;
    try {
      const result = await InvoiceModel.findOneAndDelete({ invoiceNo });
      if (!result) {
        return res.status(404).json({ error: 'Invoice not found' });
      }
      res.json({ message: 'Invoice deleted successfully' });
    } catch (err) {
      console.error('Delete invoice error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * PUT /api/invoices/:invoiceNo/payment
   * Body: { amountPaid, date }
   * Records a loan payment against an invoice.
   */
  async addLoanPayment(req, res) {
    const { invoiceNo } = req.params;
    const { amountPaid, date } = req.body;
    try {
      const invoice = await InvoiceModel.findOne({ invoiceNo });
      if (!invoice || !invoice.loanDetails) {
        return res.status(404).json({ error: 'Invoice or loan details not found' });
      }

      const paymentAmount = Number(amountPaid);
      const currentPaid = Number(invoice.loanDetails.amountPaid) || 0;
      const totalPaid = currentPaid + paymentAmount;
      const remaining = Math.max(0, Number(invoice.total) - totalPaid);

      let newStatus = 'Unpaid';
      if (remaining === 0) {
        newStatus = 'Paid';
      } else if (totalPaid > 0) {
        newStatus = 'Partially Paid';
      }

      const newPayment = { date, amount: paymentAmount };
      const existingPayments = invoice.loanDetails.payments || [];

      const updatedLoanDetails = {
        customerName: invoice.loanDetails.customerName,
        customerPhone: invoice.loanDetails.customerPhone,
        dueDate: invoice.loanDetails.dueDate,
        status: newStatus,
        amountPaid: totalPaid,
        outstandingAmount: remaining,
        payments: [...existingPayments, newPayment]
      };

      await InvoiceModel.findOneAndUpdate(
        { invoiceNo },
        { loanDetails: updatedLoanDetails }
      );

      res.json({
        message: 'Loan payment added successfully',
        updatedLoanDetails
      });
    } catch (err) {
      console.error('Loan payment error:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
};
