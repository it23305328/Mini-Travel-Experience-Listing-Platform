const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Please add a short description'],
        },
        fullDescription: {
            type: String,
            required: [true, 'Please add a full description'],
        },
        price: {
            type: Number,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Listing', listingSchema);
