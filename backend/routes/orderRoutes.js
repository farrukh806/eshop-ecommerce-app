import express from 'express';
import { isAdmin, isLoggedIn } from '../middleware/authMiddleware.js';
import {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getOrders,
	getMyPurchasedOrders,
} from '../controllers/orderController.js';

const router = express.Router();
router
	.route('/')
	.post(isLoggedIn, addOrderItems)
	.get(isLoggedIn, isAdmin, getOrders);
router.route('/myorders').get(isLoggedIn, getMyOrders);
router.route('/:id').get(isLoggedIn, getOrderById);
router.route('/:id/pay').put(isLoggedIn, updateOrderToPaid);
router.route('/:id/deliver').put(isLoggedIn, isAdmin, updateOrderToDelivered);
router.route('/:id/ispurchased').get(isLoggedIn, getMyPurchasedOrders);
export default router;
