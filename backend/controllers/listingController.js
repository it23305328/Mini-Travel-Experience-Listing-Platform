const Listing = require('../models/Listing');

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
    console.log('Incoming Create Listing Request:', req.body);
    console.log('Incoming File:', req.file);

    const {
        title,
        location,
        shortDescription,
        fullDescription,
        price,
    } = req.body;

    // Image URL can come from req.file (Cloudinary) or req.body.imageUrl (manual input)
    let imageUrl = '';
    if (req.file) {
        imageUrl = req.file.path;
    } else if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
    }

    console.log('Resulting Image URL:', imageUrl);

    if (!title || !location || !imageUrl || !shortDescription || !fullDescription) {
        console.log('Validation Failed: Missing required fields');
        return res.status(400).json({ message: 'Please add all required fields (including image photo or URL)' });
    }

    try {
        const listing = await Listing.create({
            title,
            location,
            imageUrl,
            shortDescription,
            fullDescription,
            price,
            creator: req.user,
        });

        console.log('Listing Created Successfully:', listing._id);
        res.status(201).json(listing);
    } catch (error) {
        console.error('Error Creating Listing:', error);
        res.status(500).json({ message: 'Server error creating listing: ' + error.message });
    }
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getAllListings = async (req, res) => {
    try {
        // Sort by newest first and populate creator's name
        const listings = await Listing.find({})
            .sort({ createdAt: -1 })
            .populate('creator', 'name');

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('creator', 'name');

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the listing creator
        if (listing.creator.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the listing creator
        if (listing.creator.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await listing.deleteOne();

        res.json({ id: req.params.id, message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
};
