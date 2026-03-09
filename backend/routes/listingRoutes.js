const express = require('express');
const router = express.Router();
const { createListing, getAllListings } = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getAllListings)
    .post(protect, createListing);

module.exports = router;
