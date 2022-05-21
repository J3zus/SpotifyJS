const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tracknumber: {
        type: Number,
        required: true,
    },
    lengthtrack: {
        type: Number,
        required: true,
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Song', SongSchema);