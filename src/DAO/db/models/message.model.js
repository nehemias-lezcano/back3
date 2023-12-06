const {Schema, model} = require('mongoose');

const collection = 'messages'

const messageSchema = new Schema({
        message: String, 
        user: String
})

const messageModel = model(collection, messageSchema);

module.exports = {messageModel};