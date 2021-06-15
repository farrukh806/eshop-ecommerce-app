import expressAsyncHandler from 'express-async-handler';
import Product from '../models/product.js';

//Fetch all products
const getProducts = expressAsyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};
	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// Create a review
const createProductReview = expressAsyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			const alreadyReviewed = product.reviews.find(
				(r) => r.user.toString() === req.user._id.toString()
			);
			if (alreadyReviewed) {
				res.status(400);
				throw new Error(`Product already reviewed`);
			}
			const review = {
				name: req.user.name,
				rating: Number(rating),
				comment,
				user: req.user._id,
			};
			product.reviews.push(review);
			product.numReviews = product.reviews.length;
			product.rating =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				product.reviews.length;

			await product.save();
			res.status(201).json({ message: 'Review Added' });
		} else {
			res.status(404);
			throw new Error(`Product new found`);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

// Fetch top rated products
const getTopRatedProducts = expressAsyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);
	res.status(200).json(products);
});
export {
	getProducts,
	getProductById,
	deleteProductById,
	createProduct,
	updateProduct,
	createProductReview,
	getTopRatedProducts
};
