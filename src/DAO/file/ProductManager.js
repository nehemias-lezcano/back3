const fs = require('fs');

const path = './data/Products.json'
class ProductManager {
    constructor(path) {
        this.path = path
    }
    //Carga de productos desde el JSON
    loadProducts = async ()=> {
        try{
            if(fs.existsSync(path)){
            const products = await fs.promises.readFile (path, 'utf-8')
            return JSON.parse (products)}
            await fs.promises.writeFile (path,'[]','utf-8')
            return []
        } catch (error) {
            console.log (error);
        }        
    }

    addProduct = async (product)=> {
        try {           
        const products = await this.loadProducts()

         //Validamos que cada el objeto tenga todas las propiedades
        if (!product.hasOwnProperty('title') ||
        !product.hasOwnProperty('description') ||
        !product.hasOwnProperty('code') ||
        !product.hasOwnProperty('price') ||
        !product.hasOwnProperty('stock') ||
        !product.hasOwnProperty('category')) {
        const respuesta = {
            status: 'error',
            message: 'El producto no tiene todas las propiedades requeridas',
            success: false};
        return respuesta
    }

        // Validamos el tipo de cada propiedad
        if (typeof product.title !== 'string' ||
            typeof product.description !== 'string' ||
            typeof product.code !== 'string' ||
            typeof product.price !== 'number' ||
            typeof product.stock !== 'number' ||
            typeof product.category !== 'string'
            //||!Array.isArray(product.thumbnails)
            ) {
            const respuesta = {
                status: 'error',
                message: 'El producto tiene una o más propiedades con un tipo incorrecto',
                succes:false}
            return respuesta
            }   

        //Chequeo que el código de producto no se repita
        if (products.find((p) => p.code === product.code)) {
            const respuesta = {
                status: 'error',
                message: 'Ya se ha ingresado un producto con ese código',
                success: false};
            return respuesta
            }

        const newProduct = {
            id: products.length === 0 ? 1:products[products.length-1].id+1,
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            status: true
            };
            //Pusheo el nuevo producto en products y lo escribo en el Json
        products.push(newProduct);
        await fs.promises.writeFile (path,JSON.stringify(products),'utf8');
        const respuesta = {
            status: 'success',
            message: 'Se ha creado un nuevo producto',
            succes: true,
            payload:newProduct}
        return respuesta
        }catch (error){
            console.log (error);
        }
    }

    getProducts = async () => {
        try{
            const products = await this.loadProducts();
            console.log (products)
            return products;
        } catch (error){
            console.log (error)
        }
    }

    getProductById = async (id) => {
        try {
            const products = await this.loadProducts()
            const product = products.find((p) => p.id === Number(id))
            if (!product) {
                console.log ("No se han encontrado productos con ese ID");
                return;
            }
            return product
        } catch (error) {
            console.log (error)
        }
    }

    updateProduct = async (id, updatedProduct) => {
        try {
            const products = await this.loadProducts();
            if(isNaN(Number(id))) {
            const respuesta = {
                message:'No es un ID válido',
                success:false
            }
            return respuesta }
            const productIndex = products.findIndex((p) => p.id === Number(id));
            if (productIndex === -1) {
                const respuesta = {
                    status:'error',
                    message:'No se han encontrado productos con ese ID',
                    success:false
                }
                return respuesta;
            }
            const updatedProductWithId = Object.assign(products[productIndex],updatedProduct)
            //me aseguro que no se modifique el ID
            updatedProductWithId.id = Number(id)

            // Validamos el tipo de cada propiedad
            if (typeof updatedProductWithId.title !== 'string' ||
            typeof updatedProductWithId.description !== 'string' ||
            typeof updatedProductWithId.code !== 'string' ||
            typeof updatedProductWithId.price !== 'number' ||
            typeof updatedProductWithId.stock !== 'number' ||
            typeof updatedProductWithId.category !== 'string'
            //||!Array.isArray(updatedProductWhitId.thumbnails)
            ) {
            const respuesta = {
                        status: 'error',
                        message: 'El producto tiene una o más propiedades con un tipo incorrecto',
                        success:false}
            return respuesta
            }

            products[productIndex] = updatedProductWithId;
            await fs.promises.writeFile (path,JSON.stringify(products),'utf8');
            const respuesta = {
                status: 'success',
                message: 'Se ha modificado el producto con éxito',
                success: true
            }
            return respuesta
        } catch (error) {
            console.log (error)
        }
    }

    deleteProduct = async (id) => {
        try {
            if(isNaN(Number(id))) {
                const respuesta = {
                    status:'error',
                    message:'No es un ID válido',
                    success:false
                }}
            const products = await this.loadProducts();
            const productIndex = products.findIndex((product) => product.id === Number(id));
            if (productIndex === -1) {
                const respuesta = {
                    status: 'error',
                    messagge:'No se han encontrados productos con ese ID',
                    success: false
                }
                return respuesta}

            const deletedProduct = products.splice(productIndex, 1)[0];
            await fs.promises.writeFile (path,JSON.stringify(products),'utf8');
            const respuesta = {
                status: 'success',
                messagge:'Se ha borrado el producto',
                success: true,
                payload: deletedProduct
            }
            return respuesta;
        } catch (error) {
            console.log (error)
        }
        
    }
}


module.exports = ProductManager;