const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  license: { type: String, required: true, unique: true },
  licenseExpiry: { type: Date },
  status: { 
    type: String, 
    enum: ['active', 'in-transit', 'idle', 'suspended'], 
    default: 'active' 
  },
  tripsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  experience: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Driver', driverSchema);
