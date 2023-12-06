const {generateToken} = require('../utils/generateTokenJWT')
const {UsersManagerMongo} = require('../DAO/db/users.Manager.Mongo')
const {createHash, isValidPassword} = require('../utils/bcryptHash')
const {userModel} = require('../DAO/db/models/user.model')
const {cartsManagerMongo}  = require('../DAO/db/carts.Manager.Mongo')

const carts = new cartsManagerMongo()
const users = new UsersManagerMongo()

class  SessionController {
    constructor() {}


    login = async (req, res) =>{   
            const { email, password } = req.body
            if(email === 'adminCoder@coder.com' || password === 'adminCod3r123') {
                const user = {first_name: 'Admin', last_name: 'Coder', email: 'adminCoder@coder.com', age: '99', password: 'adminCod3r123', role:'admin'}
                const token = generateToken(user)
                res.cookie('cookieToken',token,{"maxAge": 3600000, httpOnly: true}).send({status: 'success', token})
            }
            const user = await userModel.findOne({email: email}).lean()
            console.log(user)
            if (!user) {
                res.status(400).send({message: 'Usuario no encontrado'})
            }
            console.log(user)
            if (!isValidPassword(password, user.password)) {
                res.status(400).send({message: 'Contraseña incorrecta'})
            }
            const token = generateToken(user)
            res.cookie('cookieToken',token,{"maxAge": 3600000, httpOnly: true}).send({status: 'success', token})
        }
        
        
        
        
    register = async (req, res) => {
            const {first_name, last_name, email, age, password} = req.body
            let user = await userModel.findOne({email: email})
            if (user) {
                res.status(400).send({message: 'El usuario ya existe'})
            }
            user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: await carts.addCart()
            }
            console.log(user)
            const newUser = await userModel.create(user)
            res.status(201).send(newUser)

        }

    }



module.exports = new SessionController()