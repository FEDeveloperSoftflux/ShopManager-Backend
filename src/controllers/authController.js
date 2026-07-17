import { UserModel } from '../models/userModel.js';
import { verifyPassword } from '../utils/hash.js';

export const authController = {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found / کیشیئر نہیں ملا' });
      }
      if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ error: 'Incorrect password / پاس ورڈ غلط ہے' });
      }
      const { password: _, ...userData } = user.toObject();
      res.json(userData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
