import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/user.js';

const isLoggedIn = expressAsyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decodedToken.id).select('-password');
			next();
		} catch (error) {
			console.error(error.message);
			res.status(401);
			throw new Error(`Unauthorized, token failed`);
		}
	}
	if (!token) {
		res.status(401);
		throw new Error(`Unauthorized, no token found`);
	}
});

export { isLoggedIn };
