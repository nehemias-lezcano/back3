//Importaciones
const express = require('express')
const handlebars = require ('express-handlebars')
const cookieParser = require('cookie-parser')
const {Server} = require ('socket.io')
const logger = require('morgan')
const {connectDB} = require('./config/configServer')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const passport = require('passport')

const productsRouter = require ('./routes/products.router')
const viewsRouter = require ('./routes/views.router')
const cartsRouter = require ('./routes/carts.router')
const uploadsRouter = require ('./routes/uploads.router')
const sessionsRouter = require ('./routes/sessions.router')
const { socketProducts } = require('./utils/socketProducts')
const { socketChat } = require('./utils/socketChat')
const { initPassportGithub, initPassportJwt } = require('./config/configPassport')


//Inicializaciones
const app = express ()
const PORT = 8080

connectDB()

//Configuraciones
const httpServer = app.listen (PORT, ()=>{
    console.log('Listening on port 8080')
})

//Setear motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set ('view engine', 'handlebars')

//Setear body parser
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Setear static
app.use('/static', express.static(__dirname + '/public'))
app.use(cookieParser('secretWord'))


//Setear session
app.use(session({
    store: MongoStore.create ({
        mongoUrl: 'mongodb+srv://jairayala:coder123456@cluster0.aa9hemg.mongodb.net/ecommerce?retryWrites=true&w=majority',
        collectionName: 'sessions',
        mongoOptions: {useNewUrlParser: true,
            useUnifiedTopology: true},
            ttl: 1000000*6000
        }),
        secret: 'secretWord',
        resave: false,
        saveUninitialized: false,
    }))

//Setear passport
// initPassport()
initPassportJwt()
initPassportGithub()
passport.use(passport.initialize())
passport.use(passport.session())

//Setear socket.io
const io = new Server (httpServer)
socketProducts(io)
socketChat(io)


// http://localhost:8080
app.use('/', viewsRouter)

// http://localhost:8080/api/products
app.use('/api/products', productsRouter)

// httP://localhost:8080/api/carts
app.use('/api/carts', cartsRouter)

// http://localhost:8080/api/sessions
app.use('/api/sessions', sessionsRouter)

// http://localhost:8080/uploads
app.use('/uploads', uploadsRouter)


//Middlewares

app.use(logger('dev'))


