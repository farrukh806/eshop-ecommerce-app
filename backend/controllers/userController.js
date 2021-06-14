import expressAsyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/user.js';

// Auth user and get token
const authUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!(email && password)) {
		res.status(400);
		throw new Error(`All fields are compulsory`);
	}
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

// Update user profile
const updateUserProfile = expressAsyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	if (user) {
		user.name = req.body.name;
		user.email = req.body.email;
		if (req.body.password) user.password = req.body.password;
		const updatedUser = await user.save();
		const token = generateToken(updatedUser._id);
		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token,
		});
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

// Get all users
const getUsers = expressAsyncHandler(async (req, res) => {
	const users = await User.find({});
	res.status(200).json(users);
});

// Delete a user
const deleteUser = expressAsyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) {
			await user.remove();
			res.status(200).json({ message: 'User removed' });
		} else throw new Error(`User not found`);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get user profile by id

const getUserById = expressAsyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (user) res.status(200).json(user);
		else res.status(404).json({ message: 'User not found' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Edit user profile
const editUser = expressAsyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;
		const updatedUser = await user.save();
		res.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error(`User not found`);
	}
});

export {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	editUser,
	getUserById,
};
