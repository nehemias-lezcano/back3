const {Router} = require('express');
const {uploader} = require('../utils/multer');
const { trusted } = require('mongoose');

const router = Router();


router.post('/', uploader.single('file'), (req, res) => {
    try {
        res.send ({
            status: 'success',
            messaje: 'Archivo subido correctamente'
        })
    } catch (error) {
        res.send ({
            status: 'error',
            messaje: 'Error al subir archivo'
        })
        
    }
    
})


module.exports = router