const { Schema, model } = require('mongoose');

const overheadSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    items: [
        {
            sending: {
                numberOne: {
                    type: Number,
                    default: null
                },
                numberTwo: {
                    type: Number,
                    default: null
                }
            },
            carriage: {
                type: String,
                default: null
            },
            weight: {
                value: {
                    type: Number,
                    default: 0
                },
                units: {
                    type: String,
                    default: null
                }
            },
            payment: {
                type: Number,
                default: 0
            }
        }
    ]
});

module.exports = model('Overhead', overheadSchema);