const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
});

module.exports = model('Customer', customerSchema);