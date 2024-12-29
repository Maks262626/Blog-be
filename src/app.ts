import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.route';
import usersRouter from './routes/users.route';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors());
connectDB();

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});

export default app;
