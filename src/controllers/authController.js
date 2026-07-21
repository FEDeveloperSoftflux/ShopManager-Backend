import { UserModel } from '../models/userModel.js';
import { verifyPassword } from '../utils/hash.js';

export const authController = {
  /**
   * POST /api/auth/login
   * Body: { email, password }
   * Returns user data (without password) on success.
   */
  async login(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required / ای میل اور پاس ورڈ ضروری ہیں' });
      }

      const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(404).json({ error: 'User not found / کیشیئر نہیں ملا' });
      }

      if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ error: 'Incorrect password / پاس ورڈ غلط ہے' });
      }

      // Return user data without password
      const userData = user.toObject();
      delete userData.password;
      res.json(userData);
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
};
