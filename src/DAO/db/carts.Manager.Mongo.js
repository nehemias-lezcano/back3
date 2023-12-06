const {cartModel} = require ('./models/cart.model')
const {productModel} = require ('./models/product.model')

class cartsManagerMongo {
    constructor() {}

//-------------ADD CART-------------------
    async addCart () {
        try {
            let newCart = await cartModel.create({})
            console.log(newCart)
            return newCart._id
        } catch (error) {
            return new Error(error)
            
        }
    }
//-------------GET CARTS-----------------

    async getCarts () {
        try {
            return await cartModel.find().populate('products.product').lean()
        } catch (error) {
            return new Error(error)
        }
    }
//-------------GET CART BY ID--------------
    async getCartById (id) {
        try {
            const cart = await cartModel.findById(id).populate('products.product').lean()
            
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
        }
        catch (error) {
            return new Error(error)
        }
    }
//------------- ADD  PRODUCT TO CART--------------
    async addToCart (cartId, productId,quantity) {
        try {
            const cart = await cartModel.findOne({_id:cartId}).populate('products.product')
            
            if(!cart){ 
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const product = await productModel.findOne({_id:productId})
            
            if(!product){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un producto con ese ID',
                    success: false
                }
                return respuesta
            }

            const toAddProductIndex = cart.products.findIndex((p) => p.product._id.toString() === productId.toString())
            
            
            
            if (toAddProductIndex === -1) {
                cart.products.push({
                    product:productId,
                    quantity:quantity})
                console.log(cart)
                const respuesta = {
                    status: 'succes',
                    message: 'Producto agregado al carrito',
                    success: true,
                    payload: cart
                }
                await cart.save()
    
                return respuesta }

            const toAddProduct = cart.products[toAddProductIndex]
            toAddProduct.quantity += quantity
            cart.products[toAddProductIndex] = toAddProduct
            
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto agregado al carrito',
                success: true,
                payload: cart
            }
            console.log(cart)
            return respuesta
        }
        catch (error) {
            throw new Error(error)
        }
    }
//-------------DELETE CART--------------

    async deleteCart (id) {
        try {
            const deleteCart = await cartModel.findByIdAndDelete(id)
            if(!deleteCart){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }

            const respuesta = {
                status: 'succes',
                message: 'Carrito eliminado',
                payload: deleteCart,
                success: true}
            return respuesta

        } catch (error) {
            return new Error(error)
        }
    }
//-------------DELETE PRODUCT--------------

    async deleteProduct (cartId, productId) {
        try {
            const cart = await cartModel.findOne({_id:cartId})
            if(!cart){return new Error('No se ha encontrado un carrito con ese ID')}
            const product = await productModel.findOne({_id:productId})
            if(!product){return new Error('No se ha encontrado un producto con ese ID')}
            const toDeleteProductIndex = cart.products.findIndex((p) => p.product.toString() === productId.toString())
            if (toDeleteProductIndex === -1) {return new Error('No se ha encontrado ese producto en el carrito')}
            cart.products.splice(toDeleteProductIndex,1)
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto eliminado del carrito',
                payload: cart,
                success: true}
            return respuesta
        }
        catch (error) {
            return new Error(error)
        }
    }

    //-----------UPDATE CART-------------

    async updateCart (id, cart) {
        try {
            const updateCart = await cartModel.findByIdAndUpdate({_id:id}, cart)
            if(!updateCart){
                const respuesta = {
                    status:'not found',
                    message:'No se ha encontrado un carrito con ese ID',
                    success: false
                }
                return respuesta
            }
            const respuesta = {
                status: 'succes',
                message: 'Carrito actualizado',
                payload: updateCart,
                success: true}
            return respuesta
        } catch (error) {
            return new Error(error)
        }
    
    }

    //-----------UPDATE CART PRODUCT-------------
    async updateCartProduct (cartId, productId, quantity) {
        try {
            //Validamos que el carrito exista
            const cart = await cartModel.findOne({_id:cartId})
            if(!cart) {return new Error('No se ha encontrado un carrito con ese ID')}
            //Validamos que el producto exista
            const product = await productModel.findOne({_id:productId})
            if(!product){return new Error('No se ha encontrado un producto con ese ID')}
            //Validamos que el producto este en el carrito
            const toUpdateProductIndex = cart.products.findIndex((p) => p.product.toString() === productId.toString())
            if (toUpdateProductIndex === -1) {return new Error('No se ha encontrado ese producto en el carrito')}
            cart.products[toUpdateProductIndex].quantity = quantity
            await cart.save()
            const respuesta = {
                status: 'succes',
                message: 'Producto actualizado',
                payload: cart,
                success: true
            }
            return respuesta    

        } catch (error) {
            return new Error(error)
        }
    }
}

module.exports = {cartsManagerMongo}