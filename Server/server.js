const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Order Tracking System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      orders: '/api/order',
      users: '/api/users',
      settings: '/api/settings'
    }
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
};

startServer(PORT);