const express = require('express');
const router = express.Router();
const { createListing, getAllListings, getListingById } = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getAllListings)
    .post(protect, createListing);

router.route('/:id')
    .get(getListingById);

module.exports = router;
