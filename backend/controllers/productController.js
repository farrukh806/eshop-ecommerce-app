import expressAsyncHandler from 'express-async-handler';
import Product from '../models/product.js';

//Fetch all products
const getProducts = expressAsyncHandler(async (req, res) => {
	const products = await Product.find({});
	res.json(products);
});

//Fetch single product
const getProductById = expressAsyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error(`Product not found`);
	}
});

// Delete a product
const deleteProductById = expressAsyncHandler(async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);
		if (deletedProduct) {
			res.status(200).json({ message: 'Product ' });
		} else {
			throw new Error(`Product not found`);
		}
	} catch (error) {
		res.staus(404).json({ message: error.message });
	}
});

// Create a product
const createProduct = expressAsyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample Name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.png',
		brand: 'Sample Brand',
		category: 'Sample Category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample Description',
	});
	try {
		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} catch (error) {
		throw new Error(error.message);
	}
});

// Update a product
const updateProduct = expressAsyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } =
		req.body;
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.name = name;
			product.price = price;
			product.description = description;
			product.image = image;
			product.brand = brand;
			product.category = category;
			product.countInStock = countInStock;

			const updatedProduct = await product.save();
			res.status(200).json(updatedProduct);
		} else {
			res.status(404);
			throw new Error(`Product new found`);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

export {
	getProducts,
	getProductById,
	deleteProductById,
	createProduct,
	updateProduct,
};
