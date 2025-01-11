const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for faster subcategory-based queries
productSchema.index({ subcategory: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema); 