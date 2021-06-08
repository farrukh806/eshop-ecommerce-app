import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
	res.send('API is running');
});
app.use('/api/products/', productRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/orders/', orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, (success, err) => {
	if (!err) {
		console.log(`Server started at ${PORT}`.magenta);
	} else console.error(err);
});
