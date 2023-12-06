const {Schema, model} = require('mongoose');

const collection = 'carts'

const cartSchema = new Schema({
    products: [{
        _id: false,
        quantity: {
            required: true,
            type: Number},
        product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "products"
        }
        
    }]
})

const cartModel = model(collection, cartSchema);

module.exports = {cartModel}