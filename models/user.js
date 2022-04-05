const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'admin',
        enum: ['admin']
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
});

module.exports = model('User', userSchema);