const socket = io()
    const div = document.getElementById('container')
    socket.on ('products', data =>{
        console.log (data)

        
        let productsHTML = ''
        data.forEach((product)=>{
            productsHTML += `<div class="product"> <p>ID: ${product.id}</p><p>Producto: ${product.title}</p> <p>Categoria: ${product.category}</p> <p>Precio: $${product.price}</p><p>Imagen: ${product.thumbnail}</p> <p>Código: ${product.code}</p> <p>Stock: ${product.stock}</p> </div>`
        })
        div.innerHTML = productsHTML

    })