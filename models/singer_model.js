const mongoose = require('mongoose');

const SingerSchema = new mongoose.Schema({
    artisticname: {
        type: String,
        required: true,
    },
    realname: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    album: {
        type: [String]
    },
    estado: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Singer', SingerSchema);