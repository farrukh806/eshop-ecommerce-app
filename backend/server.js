import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
connectDB();

app.use('/api/products/', productRoutes);

app.get('/', (req, res) => {
	res.send('API is running');
});

app.listen(PORT, (success, err) => {
	if (!err) {
		console.log(
			`Server started at ${PORT} in ${process.env.NODE_ENV} mode`.magenta
		);
	} else console.error(err);
});
