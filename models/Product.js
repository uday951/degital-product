const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['digital', 'physical'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  splineEmbedUrl: {
    type: String
  },
  downloadLink: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);