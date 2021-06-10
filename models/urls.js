let mongoose = require('mongoose');

let schema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        unique: true
    }
})

let urls = new mongoose.model('Urls', schema);

module.exports = urls;