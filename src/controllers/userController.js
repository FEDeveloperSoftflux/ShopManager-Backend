import { UserModel } from '../models/userModel.js';
import { verifyPassword, hashPassword } from '../utils/hash.js';

export const userController = {
  /**
   * GET /api/users/cashiers
   * Returns all users (without passwords).
   */
  async getCashiers(req, res) {
    try {
      const users = await UserModel.find({}, '-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      console.error('Get cashiers error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/users/cashiers
   * Body: { name, urduName, email, password, role }
   * Creates a new cashier/user account.
   */
  async addCashier(req, res) {
    const { name, urduName, email, password, role } = req.body;
    try {
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email, and password are required / نام، ای میل اور پاس ورڈ ضروری ہیں' });
      }

      const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered / ای میل پہلے سے موجود ہے' });
      }

      const newUser = new UserModel({
        name,
        urduName: urduName || name,
        email: email.toLowerCase().trim(),
        password: hashPassword(password),
        role: role || 'Staff Cashier',
        image: ''
      });

      await newUser.save();

      const userData = newUser.toObject();
      delete userData.password;
      res.status(201).json({ message: 'Cashier profile created successfully', cashier: userData });
    } catch (err) {
      console.error('Add cashier error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * DELETE /api/users/cashiers/:email
   * Deletes a cashier account by email.
   * Cannot delete the primary owner account.
   */
  async deleteCashier(req, res) {
    const { email } = req.params;
    try {
      if (!email) {
        return res.status(400).json({ error: 'Email param required' });
      }

      if (email.toLowerCase() === 'ali.raza@shopmanager.com') {
        return res.status(403).json({ error: 'Primary owner account cannot be deleted' });
      }

      const result = await UserModel.findOneAndDelete({ email: email.toLowerCase().trim() });
      if (!result) {
        return res.status(404).json({ error: 'Cashier account not found' });
      }

      res.json({ message: 'Cashier account deleted successfully' });
    } catch (err) {
      console.error('Delete cashier error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * PUT /api/users/update-profile
   * Body: { currentEmail, name, urduName, email, phone, image }
   * Updates a user's profile information.
   */
  async updateProfile(req, res) {
    const { currentEmail, name, urduName, email, phone, image } = req.body;
    try {
      const user = await UserModel.findOne({ email: currentEmail.toLowerCase().trim() });
      if (!user) {
        return res.status(404).json({ error: 'User not found / کیشیئر نہیں ملا' });
      }

      const updateData = {};
      if (email && email.toLowerCase() !== currentEmail.toLowerCase()) {
        const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
          return res.status(400).json({ error: 'Email already in use / ای میل پہلے سے زیر استعمال ہے' });
        }
        updateData.email = email.toLowerCase().trim();
      }

      if (name) updateData.name = name;
      if (urduName !== undefined) updateData.urduName = urduName;
      if (phone !== undefined) updateData.phone = phone;
      if (image !== undefined) updateData.image = image;

      const updatedUser = await UserModel.findOneAndUpdate(
        { email: currentEmail.toLowerCase().trim() },
        updateData,
        { new: true }
      );

      const userData = updatedUser.toObject();
      delete userData.password;
      res.json({ message: 'Profile updated successfully', user: userData });
    } catch (err) {
      console.error('Update profile error:', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * POST /api/users/change-password
   * Body: { email, currentPassword, newPassword }
   * Changes a user's password after verifying the current one.
   */
  async changePassword(req, res) {
    const { email, currentPassword, newPassword } = req.body;
    try {
      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(404).json({ error: 'User not found / کیشیئر نہیں ملا' });
      }

      if (!verifyPassword(currentPassword, user.password)) {
        return res.status(400).json({ error: 'Current password is incorrect / موجودہ پاس ورڈ غلط ہے' });
      }

      await UserModel.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { password: hashPassword(newPassword) }
      );

      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Change password error:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
};
