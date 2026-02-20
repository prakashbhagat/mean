import express from 'express';
import { createOrder, getOrderById, updateOrder, deleteOrder, getAllOrders } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createOrderSchema, updateOrderSchema } from '../validations/order.validation';

const router = express.Router();

router.post('/orders', protect, validateRequest(createOrderSchema), createOrder);
router.get('/orders/:id', protect, getOrderById);
router.get('/orders', protect, getAllOrders);
router.put('/orders/:id', protect, validateRequest(updateOrderSchema), updateOrder);
router.delete('/orders/:id', protect, deleteOrder);

export default router;