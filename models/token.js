const { Schema, model } = require('mongoose');

const tokenSchema = new Schema({
    refreshToken: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = model('Token', tokenSchema);