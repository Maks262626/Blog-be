import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import router from './routes';

dotenv.config();

connectDB();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;
