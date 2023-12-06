const socket = io()
const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')


Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa tu nombre de usario.',
    inputValidator: (value) => {
        return !value && 'Debes ingresar tu nombre de usuario'
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value
    socket.emit('user', user)
})



chatBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatBox.value.trim().length > 0)
            socket.emit('message', {
                user,
                message: chatBox.value
            })
            chatBox.value = ''
    }

})

socket.on('newUserConnected', data => {
    if(!data){
        return
    }
    Swal.fire({
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer:  3000,
        title: `${data} se ha conectado`,
        icon:  'success'
    })

})

socket.on('messageLogs',data => {
    console.log(data)
    let messages = ''
    data.forEach(message => {
        messages += `<li>${message.user} dice: ${message.message}</li>`
    })
    messageLogs.innerHTML = messages
})