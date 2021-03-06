const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const orderSchema = new Schema({
    amount: { type: Number, required: true },
    products: [{
        product: { type: Object, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);