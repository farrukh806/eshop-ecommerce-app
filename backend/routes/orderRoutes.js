import express from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } from '../controllers/orderController.js';

const router = express.Router();
router.route('/').post(isLoggedIn, addOrderItems);
router.route('/myorders').get(isLoggedIn, getMyOrders);
router.route('/:id').get(isLoggedIn, getOrderById);
router.route('/:id/pay').put(isLoggedIn, updateOrderToPaid);
export default router;
