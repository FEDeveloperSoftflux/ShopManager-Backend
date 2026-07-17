import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  urduName: { type: String, required: true },
  phone: { type: String },
  role: { type: String, required: true },
  image: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

export const UserModel = mongoose.model('User', UserSchema);
