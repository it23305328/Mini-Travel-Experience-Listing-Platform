const User = require('../models/User');
const Listing = require('../models/Listing');
const bcrypt = require('bcryptjs');

// @desc    Get user profile and listings
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const listings = await Listing.find({ creator: req.user }).sort({ createdAt: -1 });

        res.json({
            user,
            listings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            // Token is usually handled in frontend by keeping the existing one 
            // but we can send a new one if needed. The request didn't specify.
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
