import expressAsyncHandler from 'express-async-handler';
import Order from '../models/order.js';

// Create new order
const addOrderItems = expressAsyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error(`No order items`);
	} else {
		const order = new Order({
			orderItems,
			shippingAddress,
			paymentMethod,
			taxPrice,
			shippingPrice,
			totalPrice,
			user: req.user._id,
		});
		try {
			const orderCreated = await order.save();
			res.status(201).json(orderCreated);
		} catch (error) {
			console.log(error);
			res.status(error.status).json({ message: error.message });
		}
	}
});

// Get order by Id

const getOrderById = expressAsyncHandler(async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate({
			path: 'user',
			select: 'name email',
		});
		if (order) {
			res.status(200).json(order);
		} else {
			res.status(404).json({ message: 'Order not found.' });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

// Update order to paid

const updateOrderToPaid = expressAsyncHandler(async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (order) {
			order.isPaid = true;
			order.paidAt = Date.now();
			order.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.payer.email_address,
			};
			const updatedOrder = await order.save();
			res.status(200).json(updatedOrder);
		} else {
			res.status(404).json({ message: 'Order not found.' });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

// Show orders
const getMyOrders = expressAsyncHandler(async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id });
		res.status(200).json(orders);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
});

// Show all orders
const getOrders = expressAsyncHandler(async (req, res) => {
	try {
		const orders = await Order.find({}).populate({
			path: 'user',
			select: 'name email',
		});
		res.status(200).json(orders);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
});

// Update order to delivered
const updateOrderToDelivered = expressAsyncHandler(async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (order) {
			if (order.isPaid && !order.isDelivered) {
				order.isDelivered = true;
				order.deliveredAt = Date.now();
			}

			const updatedOrder = await order.save();
			res.status(200).json(updatedOrder);
		} else {
			res.status(404).json({ message: 'Order not found.' });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: error.message });
	}
});

// Purchased orders

const getMyPurchasedOrders = expressAsyncHandler(async (req, res) => {
	try {
		const orders = await Order.find({
			user: req.user._id,
			isPaid: true,
			isDelivered: true,
		});
		let isPurchased;
		if (orders) {
			orders.forEach((order) => {
				order.orderItems.forEach((item) => {
					if (item.product.toString() === req.params.id) {
						isPurchased = true;
					}
				});
			});
			if (isPurchased) res.status(200).json({ success: true });
			else res.status(200).json({ success: false });
		} else {
			res.status(404).json({ success: false });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
});
export {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getOrders,
	getMyPurchasedOrders,
};
