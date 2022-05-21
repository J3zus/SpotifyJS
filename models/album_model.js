const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    label: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: false
    },
    estado: {
        type: Boolean,
        default: true
    },

    song: {
        type: [String]
    }
});

module.exports = mongoose.model('Album', AlbumSchema);