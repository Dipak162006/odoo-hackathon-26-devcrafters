const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// GET all
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('driverId');
    res.json({ data: vehicles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ data: vehicle });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ data: vehicle });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
