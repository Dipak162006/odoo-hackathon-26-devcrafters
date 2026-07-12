const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// GET all
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json({ data: drivers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ data: driver });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ data: driver });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
