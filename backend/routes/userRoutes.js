import express from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import {
	authUser,
	getUserProfile,
	registerUser,
} from '../controllers/userController.js';
const router = express.Router();

router.route('/login').post(authUser);
router.route('/').post(registerUser);
router.route('/profile').get(isLoggedIn, getUserProfile);

export default router;
