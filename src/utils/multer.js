const multer = require('multer');
const {dirname} = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${dirname(__dirname)}/public/uploads`)
    },
    filename: function (req, file, cb) {
        console.log ('file:', file)
        cb(null, `${Date.now()}_${file.originalname}`)
    }

})

const uploader = multer({
    storage,
    onError: function (err, next) {
        console.log('error:', err)
        next(err)
    }
})

module.exports = {uploader};