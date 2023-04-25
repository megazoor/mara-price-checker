const express = require('express');
const router = express.Router();
const axios = require('axios');
const Price = require('../models/Price');

// Replace YOUR_API_KEY with your actual Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = '5JEXO6JFMUAJ2CG8';

// Get all prices
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the latest MARA price and save it to the database
router.get('/update', async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MARA&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    const priceData = response.data['Global Quote'];
    const currentPrice = parseFloat(priceData['05. price']);

    const newPrice = new Price({
      price: currentPrice,
      timestamp: new Date(),
    });

    const savedPrice = await newPrice.save();
    res.json(savedPrice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single price by ID
router.get('/:id', async (req, res) => {
    try {
      const price = await Price.findById(req.params.id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
      res.json(price);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update a single price by ID
  router.patch('/:id', async (req, res) => {
    try {
      const price = await Price.findById(req.params.id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
  
      if (req.body.price) {
        price.price = req.body.price;
      }
  
      const updatedPrice = await price.save();
      res.json(updatedPrice);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Delete a single price by ID
  router.delete('/:id', async (req, res) => {
    try {
      const price = await Price.findById(req.params.id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
  
      await price.remove();
      res.json({ message: 'Price deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
