import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import products from './data/products.js';
import connectDB from './config/db.js';
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

connectDB();

app.get('/', (req, res) => {
	res.send('API is running');
});

app.get('/api/products', (req, res) => {
	res.json(products);
});

app.get('/api/products/:id', (req, res) => {
	const product = products.find((p) => p._id === req.params.id);
	res.json(product);
});
app.listen(PORT, (success, err) => {
	if (!err)
		console.log(
			`Server started at ${PORT} in ${process.env.NODE_ENV} mode`.magenta.bold
		);
	else console.log(err);
});
