// models/link.model.js
import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: [true, 'Original URL is required.'],
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
        },
        clicks: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true
    }
);

const Link = mongoose.model('Link', LinkSchema, 'shorter_link');

export default Link;