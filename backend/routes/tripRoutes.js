const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// GET all
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().populate('vehicleId').populate('driverId');
    res.json({ data: trips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST dispatch
router.post('/dispatch', async (req, res) => {
  try {
    const { route, departure, vehicleId, driverId, cargoWeight } = req.body;

    // Step 1: Find and check statuses
    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await Driver.findById(driverId);

    if (!vehicle || !driver) {
      return res.status(404).json({ error: 'Vehicle or Driver not found' });
    }
    if (vehicle.status !== 'active' || driver.status !== 'active') {
      return res.status(400).json({ error: 'Both Vehicle and Driver must be active' });
    }

    // Step 2: Create Trip
    const trip = new Trip({
      route,
      departure,
      vehicleId,
      driverId,
      cargoWeight,
      status: 'in-transit'
    });

    // Step 3: Update Vehicle and Driver statuses
    vehicle.status = 'in-transit';
    driver.status = 'in-transit';

    // Step 4: Save all documents
    await vehicle.save();
    await driver.save();
    await trip.save();

    res.status(201).json({ data: trip });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST complete trip
router.post('/:id/complete', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.status === 'completed') {
      return res.status(400).json({ error: 'Trip is already completed' });
    }

    // Update Trip status
    trip.status = 'completed';
    await trip.save();

    // Revert Vehicle status
    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (vehicle) {
      vehicle.status = 'active';
      await vehicle.save();
    }

    // Revert Driver status & increment tripsCount
    const driver = await Driver.findById(trip.driverId);
    if (driver) {
      driver.status = 'active';
      driver.tripsCount += 1;
      await driver.save();
    }

    res.json({ data: trip });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
