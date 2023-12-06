const { isValidPassword } = require('../../utils/bcryptHash')
const {userModel} = require('./models/user.model')

class UsersManagerMongo {
    constructor() {}

    async addUser(user) {
        try {
            
            //Validamos que el usuario tenga todas sus propiedades
            if (!user.email || !user.password || !user.first_name || !user.last_name) {
                const respuesta = {
                    status: 'error',
                    message: 'Faltan datos',
                    success: false
                }
                return respuesta
            } 
            
            //Validamos que el usuario no exista
            const userExist = await userModel.findOne({email: user.email})
            if (userExist) {
                const respuesta = {
                    status: 'error',
                    message: 'El usuario ya existe',
                    success: false
                }
                return respuesta
            }
            
            //Si email es igual adminCoder@coder.com y contraseña es igual a adminCod3r123
            //El usuario es administrador
            if (user.email === 'adminCoder@coder.com') {
                const respuesta = {
                    status: 'error',
                    message: 'Este mail no está permitido',
                    success: false
                }
                return respuesta
            }
            

            
            //Creamos el usuario
            const newUser = new userModel(user)
            console.log(newUser)
            await newUser.save()

            const respuesta = {
                status: 'success',
                message: 'Usuario creado correctamente',
                payload: newUser,
                success: true
            }

            return respuesta
    
    
           
        } catch (error) {

            throw new Error(error)
        }
    }

    async findUserByEmail (email) {
        try {
            const user = await userModel.findOne({email: email})
            return user

        }
        catch (error) {
            throw new Error(error) 
        }
    } 

    async authenticateUser (email, password) {
        const user =  await this.findUserByEmail(email)
        if(!user){
            return res.status(401).send({ message: 'Credenciales inválidas' });
        }
         // Verificar la contraseña
        if (!isValidPassword(password, user)) {
            return res.status(401).send({ message: 'Credenciales inválidas' });
        }
        return user
        
    }
}

module.exports = {UsersManagerMongo}