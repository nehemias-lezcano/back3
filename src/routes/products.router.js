const { Router} =  require('express')
const ProductManager = require ('../DAO/db/products.Manager.Mongo')
const { query, validationResult } = require('express-validator');




const router = Router();
const products = new ProductManager()

//-----------------GET------------------------------------------
router.get('/',[
    query('limit').optional().isInt().toInt().isInt({ min: 1 }).isInt({ max: 100 }),
    query('page').optional().isInt().toInt().isInt({ min: 1 }).isInt({ max: 100 }),
    query('priceSort').optional().isIn(['asc', 'desc']),
    query('category').optional(),
    query('availability').optional()
    ],async (req,res)=>{
    try{
        const errors = validationResult(req);
        //Si hay errores, devuelve un error 400 con los errores
        if (!errors.isEmpty()) {
            return res.status(400).send({message: 'Error en los parametros de entrada', errors});
        }

        //Si no hay errores, se ejecuta la consulta
        const {limit = 10, page = 1, priceSort = null, category = null, availability = null} = req.query
        //Se crea un objeto con los filtros
        const filter = {}
        if(category) {
            filter.category = category
        }
        if(availability) {
            filter.status = availability
        }
        //Se crea un objeto con los ordenamientos
        let sort = null

        if(priceSort==='asc'){
            sort = {price: 1}
        }
        if(priceSort==='desc'){
            sort = {price: -1}
        }
        //Se ejecuta la consulta
        const productList = await products.getProducts(limit, page, sort, filter)
        //Si devuelve falso, hay algón problema con la consulta
        if(!productList) return res.status(404).send('No se encuentran productos en la base de datos')
        //Si devuelve verdadero, Se envía el producto encontrado como respuesta al cliente
        res.status(200).send (productList)  

    } catch(error){
        res.status(400).send({status:'Router error', error})
    }
})

router.get('/:pid', async (req,res)=>{
    try{
        const {pid} = req.params
        const productList = await products.getProductById(pid)
        //Si devuelve falso, hay algón problema con el Id
        if(!productList) return res.status(404).send('Error: no se encuentra ese Id')
        //Si devuelve verdadero, se ha encontrado el producto
        res.status(200).send ({status:'success', payload:productList})
        
    } catch(error){
        res.status(400).send({status:'Router error', error})
    }
})

//---------------------POST----------------------------------------------
router.post('/', async (req, res)=> {
    try{
        const toAddProduct = req.body
        
        const respuesta = await products.addProduct(toAddProduct)
        
        //Si devuelve falso, hay algún problema con el producto
        if(!respuesta.success) {return res.status(400).send(respuesta)}

        //Si devuelve verdadero, se ha creado el nuevo producto
        res.status(200).send(respuesta)

    } catch (error) {
        res.status(400).send({status:'Router error', error})
    }

})
//----------------------PUT--------------------------------------
router.put('/:pid', async (req , res)=>{
    const {pid} = req.params
    const toChangeProduct = req.body

    const updatedProduct = await products.updateProduct(pid, toChangeProduct)

    //Sí devuelve falso, hay algún problema con la actualización
    if(!updatedProduct.success) {
        return res.status(400).send(updatedProduct)
    }
    //Si devuelve verdadero, quiere decir que se hizo la actualización
    res.status(200).send(updatedProduct)

})

//---------------------DELETE-----------------------------------------
router.delete('/:pid', async (req,res)=>{
    const {pid} = req.params
    const deletedProduct = await products.deleteProduct(pid)
    //Sí devuelve falso, hay algún problema con el borrado
    if(!deletedProduct.success){
        return res.status(400).send(deletedProduct)
    }
    //Si devuelve verdadero, quiere decir que se borró el producto
    res.status(200).send(deletedProduct)
})

module.exports = router