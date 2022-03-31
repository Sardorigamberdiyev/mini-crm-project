const { Schema, model } = require('mongoose');

const stateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
        enum: ['USD']
    },
    cost: {
        type: Number,
        required: true
    }
});

module.exports = model('State', stateSchema);