import express from 'express';
import {
	getProducts,
	getProductById,
	deleteProductById,
	createProduct,
	updateProduct,
} from '../controllers/productController.js';
import { isAdmin, isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(isLoggedIn, isAdmin, createProduct);

router
	.route('/:id')
	.get(getProductById)
	.delete(isLoggedIn, isAdmin, deleteProductById)
	.put(isLoggedIn, isAdmin, updateProduct);

export default router;
