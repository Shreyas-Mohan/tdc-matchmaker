import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';
// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies
app.use('/api/customers', customerRoutes);
// Base Test Route
app.use((err, req, res, next) => {
  console.error(`Unhandled operational error: ${err.stack}`);
  res.status(500).json({ error: 'Internal server processing error encountered.' });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});