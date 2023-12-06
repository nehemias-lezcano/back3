const {messageModel} = require('../DAO/db/models/message.model');

const getMessages = async () => {
        try { 
        return await messageModel.find()
    } catch (error) {
        throw new Error (error)
    }
}
let chat = []
const socketChat = (io) => {
    
    io.on('connection', (socket) => {
        console.log('Usuario Conectado');
        getMessages().then((messages)=>{
            chat = messages
            io.emit('messageLogs', chat)
        })
        socket.on('user', data =>{
            socket.broadcast.emit('newUserConnected', data)
        })
        socket.on('message', async (data)=>{
            console.log(data)
            try {
                const newMessage = await messageModel.create(data)
                chat.push(newMessage)
                io.emit('messageLogs', chat)
            } catch(error) {
                throw new Error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log('Usuario Desconectado');
        });
    });
    return io;

}

module.exports = {socketChat}