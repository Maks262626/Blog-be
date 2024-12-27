import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())

connectDB();

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});

export default app;
