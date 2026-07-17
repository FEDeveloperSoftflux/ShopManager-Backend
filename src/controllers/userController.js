import { UserModel } from '../models/userModel.js';
import { verifyPassword, hashPassword } from '../utils/hash.js';
 
export const userController = {
  async updateProfile(req, res) {
    const { currentEmail, name, urduName, email, phone, image } = req.body;
    try {
      const user = await UserModel.findOne({ email: currentEmail });
      if (!user) {
        return res.status(404).json({ error: 'User not found / کیشیئر نہیں ملا' });
      }
 
      // If email is changing, verify it is not already taken by another user
      if (email && email.toLowerCase() !== currentEmail.toLowerCase()) {
        const existing = await UserModel.findOne({ email: email.toLowerCase() });
        if (existing) {
          return res.status(400).json({ error: 'Email already in use / ای میل پہلے سے زیر استعمال ہے' });
        }
        user.email = email.toLowerCase();
      }
 
      if (name) user.name = name;
      if (urduName) user.urduName = urduName;
      if (phone) user.phone = phone;
      if (image) user.image = image;
 
      await user.save();
      const { password: _, ...userData } = user.toObject();
      res.json({ message: 'Profile updated successfully', user: userData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
 
  async changePassword(req, res) {
    const { email, currentPassword, newPassword } = req.body;
    try {
      const user = await UserModel.findOne({ email: email?.toLowerCase() });
      if (!user) {
        return res.status(404).json({ error: 'User not found / کیشیئر نہیں ملا' });
      }
 
      // Verify current password
      if (!verifyPassword(currentPassword, user.password)) {
        return res.status(400).json({ error: 'Current password is incorrect / موجودہ پاس ورڈ غلط ہے' });
      }
 
      // Update with hashed new password
      user.password = hashPassword(newPassword);
      await user.save();
 
      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
