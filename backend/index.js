import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {console.log('Connected to MongoDB')})
  .catch((error) => {console.log(error)});

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.use('/backend/user', userRoutes);
app.use("/backend/auth", authRoutes);


app.use((err, req, res, next) => {
  const errorStatus = err.statuscode || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
})