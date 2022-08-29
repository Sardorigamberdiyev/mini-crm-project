const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    firm: {
        type: String,
        required: true,
        enum: ['firm-1', 'firm-2']
    },
    dateIssue: {
        type: Date,
        required: true
    },
    senderStation: {
        type: String,
        required: true
    },
    arrivalStation: {
        type: String,
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    cargoType: {
        type: String,
        required: true,
        enum: ['мпс', 'спс']
    },
    carriageId: {
        type: Schema.Types.ObjectId,
        ref: 'Carriage',
        required: true
    },
    carriageCount: {
        type: Number,
        required: true,
        default: 0
    },
    carriageReturn: {
        type: Number,
        default: 0
    },
    carriageRemainder: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 0
    },
    additionalFee: {
        type: Number,
        default: 0
    },
    pricePerTon: {
        type: Number,
        default: 0
    },
    additionalInfo: {
        infoText: {
            type: String,
            default: null
        },
        infoColor: {
            type: String,
            default: null
        }
    },
    territoryTransportation: [
        {
            customHouseFeeId: {
                type: Schema.Types.ObjectId,
                ref: 'CustomHouseFee',
                required: true
            },
            firstCode: {
                type: Number,
                required: true
            },
            lastCode: {
                type: Number,
                required: true
            }
        }
    ],
    generalRate: {
        type: Number,
        required: true
    },
    tlg: {
        uzsPrice: {
            type: Number,
            default: 0
        },
        usdPrice: {
            type: Number,
            default: 0
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    doing: {
        cost: {
            type: Number,
            default: 0
        },
        date: {
            type: Date,
            default: null
        }
    },
    debt: {
        type: Number,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    changedProperties: [
        {
            type: String
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = model('Order', orderSchema);