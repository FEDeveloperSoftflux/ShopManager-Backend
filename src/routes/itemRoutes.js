import express from 'express';
import { itemController } from '../controllers/itemController.js';

const router = express.Router();

router.get('/', itemController.getAllItems);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

// Bulk price update (mounted separately in app.js as /api/items-bulk/prices)

export default router;
