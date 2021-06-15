import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log(`MongoDB is Connected: ${conn.connection.host}`.cyan.underline);
	} catch (error) {
		console.error(`Error:${error.message}`.red.bold);
		process.exit(1);
	}
};

export default connectDB;
