import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

// Direct /api/users routes (saves to `users` collection in MongoDB)
router.get('/', userController.getCashiers);
router.post('/', userController.addCashier);
router.delete('/:email', userController.deleteCashier);

// Aliases for backwards compatibility
router.get('/cashiers', userController.getCashiers);
router.post('/cashiers', userController.addCashier);
router.delete('/cashiers/:email', userController.deleteCashier);

router.put('/update-profile', userController.updateProfile);
router.post('/update-profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);

export default router;
