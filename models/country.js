const { Schema, model } = require('mongoose');

const countrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
});

module.exports = model('Country', countrySchema);