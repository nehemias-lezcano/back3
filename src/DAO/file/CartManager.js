const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path
    }

    loadCarts = async () => {
        try{
            if(fs.existsSync(this.path)){
            const carts = await fs.promises.readFile (this.path, 'utf-8')
            return JSON.parse (carts)}
            await fs.promises.writeFile (this.path, '[]','utf-8')
            return []
        } catch(error){
            console.log(error)
        }
    }

    newCart = async(cart) => {
        try{
            if(!Array.isArray(cart)){
                const respuesta = {
                    status:'error',
                    message:'El carrito enviado',
                    succes: false
                }
            }
            const carts = await this.loadCarts()
            const newCart = {
                id: carts.length === 0 ? 1 : carts[carts.length-1].id+1,
                products: cart
            }
            carts.push(newCart)
            await fs.promises.writeFile (this.path,JSON.stringify(carts))
            const respuesta ={
                status:'succes',
                message: 'Se ha creado un nuevo carrito',
                succes: true,
                payload: newCart
            }
            return respuesta
        } catch (error){
            console.log(error)
        }
    }

    getCartById = async(id) => {
        try{
            const carts = await this.loadCarts()
            const cart = carts.find((c)=> c.id === Number(id))
            if(!cart){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const respuesta = {
                status: 'succes',
                message: 'Carrito encontrado',
                success: true,
                payload: cart
            }
            return respuesta
        } catch (error) {
            console.log (error)
        }
    }

    addToCart = async (cart, id)=>{
        try{
            if (isNaN(id)){
                const respuesta = {
                    status: 'error',
                    message: 'El id no es un Número',
                    succes: false
                }
                return respuesta
            }
            const carts = await this.loadCarts()
            const cartIndex = carts.findIndex((c) => c.id === cart.id)
            const productIndex = cart.products.findIndex((p)=>p.id === Number(id))
            //si no se encuentra el id en el carrito, se genera un nuevo producto con cantida 1
            if(productIndex === -1) {
                cart.products.push({id: parseInt(id) ,quantity:1})
                carts[cartIndex] = cart
                await fs.promises.writeFile (this.path,JSON.stringify(carts),'utf8')
                const respuesta = {
                    status:'succes',
                    message: 'Se ha agregado un nuevo producto al carrito',
                    succes: true,
                    payload: cart
                }
                return respuesta
            }
            //si se encuentra el id en el carrito, se le suma 1 a la cantidad de este producto
            cart.products[productIndex].quantity +=1
            carts[cartIndex] = cart
            await fs.promises.writeFile (this.path,JSON.stringify(carts),'utf8')
            const respuesta = {
                status:'succes',
                message: 'Se ha agregado el producto al carrito',
                succes: true,
                payload: cart
            }
            return respuesta
        } catch (error) {
            console.log (error)
        }
    }

}

module.exports = CartManager;