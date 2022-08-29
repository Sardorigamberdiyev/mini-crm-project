const { Schema, model } = require('mongoose');

const customHouseFeeSchema = new Schema({
    price: {
        type: Number,
        required: true,
        default: 0
    },
    carriageId: {
        type: Schema.Types.ObjectId,
        ref: 'Carriage',
        required: true
    },
    countryId: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
        select: false
    }
});

module.exports = model('CustomHouseFee', customHouseFeeSchema);