import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import colors from 'colors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());

connectDB();

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
	res.send(process.env.PAYPAL_CLIENT_ID)
);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'frontend/build')));
	app.get('*', (req, res) =>
		res.sendFile(path.resolve(__dirname, 'frontend/build/index.html'))
	);
}
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, (success, err) => {
	if (!err) {
		console.log(`Server started at ${PORT}`.magenta);
	} else console.error(err);
});
