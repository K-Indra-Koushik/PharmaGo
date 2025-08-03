const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['OTC', 'Prescription']
  },
  dosage: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: '/default-medicine.jpg'
  },
  requiresPrescription: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine; 