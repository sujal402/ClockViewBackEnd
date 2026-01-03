import connectDB from "./utils/db.js";
import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './api/auth/authRoute.js';
import contactRoutes from './api/contact/contactRoute.js';
import productRoutes from './api/products/productRoute.js';
import userRoutes from './api/users/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data (without files)

app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(cookieParser());
app.use(logger);

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/', contactRoutes);
app.use('/api/product', productRoutes);
app.use('/api/user',userRoutes);

app.get("/", (req, res) => {
  res.send("Clock Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});