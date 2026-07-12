const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  route: { type: String },
  date: { type: Date, default: Date.now },
  departure: { type: String },
  arrival: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'in-transit', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  cargoWeight: { type: Number }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Trip', tripSchema);
