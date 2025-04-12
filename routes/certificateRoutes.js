const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// POST route to save certificate
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const newCertificate = new Certificate(data);
    await newCertificate.save();
    res.status(201).json({ success: true, message: 'Certificate saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
