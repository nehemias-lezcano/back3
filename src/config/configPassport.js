const passport = require ('passport');
// const local = require ('passport-local')
const GitHubStrategy = require('passport-github2')
const {Strategy, ExtractJwt} = require('passport-jwt')
const {userModel} = require('../DAO/db/models/user.model')
const {createHash, isValidPassword} = require('../utils/bcryptHash')
const {privateKey} = require ('../config/configServer')

// const localStrategy = local.Strategy

//Inicializamos passport-Jwt
const JWTStrategy = Strategy
const ExtractJWT = ExtractJwt
let cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies){
        token = req.cookies['cookieToken']
    }
    return token
}

const initPassportJwt = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    }, async (jwt_payload, done) => {
        try {
            done(null, jwt_payload)
        } catch (error) {
            return done(error)
        
        }
    }))
}



//Inicializamos  passport local
// const initPassport = () => {
//     // Configuramos el registro de  passport
//     passport.use('register', new localStrategy({
//         passReqToCallback: true,
//         usernameField: 'email'
//     }, async (req, username, password, done) => {
//         const {first_name, last_name} = req.body
//         try {
//             const user = await userModel.findOne({email: username})

//             //Si existe el usuario se informa que ya existe
//             if (user) return done(null, false, {message: 'El usuario ya existe'})
//             //Si no existe el usuario se crea
//             const newUser = {
//                 first_name,
//                 last_name,
//                 email: username,
//                 password: createHash(password)
//             }
//             const userCreated = await userModel.create(newUser)
//             return done(null, userCreated)
//         } catch (error) {
//             return done('Error al obtener usuario'+error)
        
//         }
//     }))
// }


//Configuramos el login de passport y Github

const initPassportGithub = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.2d156ce38e0d6c72',//process.env.GITHUB_CLIENT_ID,
        clientSecret:  '62104768d62339f20eea822068a7e88fbee4b81e',//process.env.GITHUB_CLIENT_SECRET,
        callBackURL: 'http://localhost:8080/api/sessions/githubcallback'//process.env.GITHUB_CALLBACK_URL    
    }, async (accessToken, refreshToken, profile, done) => {
        
        try {
            let user = await userModel.findOne({email: profile._json.email})
            console.log(profile)
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password:profile._json.node_id
                }
                console.log('newUser',newUser)
                let result = await userModel.create(newUser)
                return done(null, result)
            }
            return done (null, user)
        } catch (error) {
            return done('Error al obtener el usuario'+error)
        }
            }
        )
    )
}


//------Se configura las sesiones de passport-------//
passport.serializeUser((user, done) => {
    done(null, user._id)

})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }

})

//

// passport.use('login', new localStrategy({
//     usernameField: 'email'
// }, async (username, password, done) => {
//     try {
//         const user = await userModel.findOne({email: username})
//         if (!user) return done(null, false, {message: 'Usuario no encontrado'})
//         if (!isValidPassword(password, user)) return done(null, false, {message: 'Contraseña incorrecta'})
//         return done(null, user)
//     } catch (error) {
//         return done(error)
//     }
// }))

module.exports = {
    // initPassport,
    initPassportGithub,
    initPassportJwt
}