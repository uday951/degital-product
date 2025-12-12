const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'UdayTechX API is running', version: '1.0.0' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AntiGravity Shop API is running' });
});

// Self-ping to prevent sleep
setInterval(() => {
  const url = process.env.RENDER_EXTERNAL_URL || 'https://degital-product.onrender.com';
  fetch(`${url}/api/health`)
    .then(() => console.log('Self-ping successful'))
    .catch(() => console.log('Self-ping failed'));
}, 5 * 60 * 1000); // Every 5 minutes

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;