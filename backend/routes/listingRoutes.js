const express = require('express');
const router = express.Router();
const { createListing, getAllListings, getListingById, updateListing, deleteListing } = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getAllListings)
    .post(protect, upload.single('image'), createListing);

router.route('/:id')
    .get(getListingById)
    .put(protect, updateListing)
    .delete(protect, deleteListing);

module.exports = router;
