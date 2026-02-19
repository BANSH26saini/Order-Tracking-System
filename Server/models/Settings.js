const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Order Tracking System'
  },
  companyEmail: {
    type: String,
    default: 'info@ordertracking.com'
  },
  companyPhone: {
    type: String,
    default: '+1234567890'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  taxRate: {
    type: Number,
    default: 0
  },
  orderPrefix: {
    type: String,
    default: 'ORD'
  },
  enableNotifications: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);