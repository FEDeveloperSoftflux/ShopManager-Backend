import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  category: { type: String },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  margin: { type: Number, required: true },
  barcode: { type: String, unique: true, sparse: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  status: { type: String, default: 'Active' },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  lastUpdated: { type: String }
}, { timestamps: true });

export const ItemModel = mongoose.model('Item', ItemSchema);
