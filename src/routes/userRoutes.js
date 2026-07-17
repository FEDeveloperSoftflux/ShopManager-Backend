import express from 'express';
import { userController } from '../controllers/userController.js';
 
const router = express.Router();
 
router.post('/update-profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
 
export default router;
