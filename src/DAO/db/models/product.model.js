/// Esquema
const {Schema, model} = require ('mongoose')
const moongosePaginate = require('mongoose-paginate-v2')

const collection = 'products'

const  productSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price:  {type: Number, required: true},
    thumbnail: {type: [String]},
    stock: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    status: {type: Boolean, default: true}
})

productSchema.plugin(moongosePaginate)

const productModel = model(collection, productSchema)

module.exports = {
    productModel
}
