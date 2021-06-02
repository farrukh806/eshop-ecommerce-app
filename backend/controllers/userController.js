import expressAsyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/user.js';

// Auth user and get token
const authUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user && (await user.matchPassword(password))) {
		const token = generateToken(user._id);
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token,
		});
	} else {
		res.status(401);
		throw new Error(`Invalid email or password`);
	}
});

// Get user profile
const getUserProfile = expressAsyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id).select('-password');
	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404);
		throw new Error(`User not found`);
	}
});

// Register a new user
const registerUser = expressAsyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error(`User already exists`);
	} else {
		const user = await User.create({ name, email, password });
		if (user) {
			const token = generateToken(user._id);
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				token,
			});
		}
	}
});

export { authUser, getUserProfile, registerUser };
