import mongoose from 'mongoose';

const InvoiceItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

const LoanPaymentSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true }
});

const LoanDetailsSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  dueDate: { type: String, required: true },
  status: { type: String, default: 'Unpaid' },
  amountPaid: { type: Number, default: 0 },
  outstandingAmount: { type: Number, required: true },
  payments: { type: [LoanPaymentSchema], default: [] }
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  dateTime: { type: String, required: true },
  units: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  cashier: { type: String, required: true },
  items: { type: [InvoiceItemSchema], default: [] },
  loanDetails: { type: LoanDetailsSchema, default: null }
}, { timestamps: true });

export const InvoiceModel = mongoose.model('Invoice', InvoiceSchema);
