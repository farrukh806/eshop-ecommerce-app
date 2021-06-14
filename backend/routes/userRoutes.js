import express from 'express';
import { isLoggedIn, isAdmin } from '../middleware/authMiddleware.js';
import {
	authUser,
	getUserProfile,
	getUsers,
	registerUser,
	updateUserProfile,
	deleteUser,
	getUserById,
	editUser,
} from '../controllers/userController.js';
const router = express.Router();

router.route('/login').post(authUser);
router.route('/').post(registerUser).get(isLoggedIn, isAdmin, getUsers);
router
	.route('/profile')
	.get(isLoggedIn, getUserProfile)
	.put(isLoggedIn, updateUserProfile);

router
	.route('/:id')
	.delete(isLoggedIn, isAdmin, deleteUser)
	.get(isLoggedIn, isAdmin, getUserById)
	.put(isLoggedIn, isAdmin, editUser);

export default router;
