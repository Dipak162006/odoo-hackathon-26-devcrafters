const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  type: { type: String },
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  status: { 
    type: String, 
    enum: ['active', 'in-transit', 'maintenance', 'idle'], 
    default: 'active' 
  },
  fuelType: { type: String },
  mileage: { type: Number, default: 0 },
  insurance: { type: Date },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
