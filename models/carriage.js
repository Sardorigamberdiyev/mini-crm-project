const {Schema, model} = require('mongoose');

const carriageSchema = new Schema({
    typeCarriage: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    }
});

module.exports = model('Carriage', carriageSchema);