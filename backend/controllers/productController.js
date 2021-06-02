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

export { getProducts, getProductById };
