import {Server} from 'socket.io';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import mongoose from 'mongoose'; //Conexion a Mongo
import MongoStore from 'connect-mongo'; //Sessiones en Mongo
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import chatRouter from './routes/chat.routes.js';
import homeRouter from './routes/home.routes.js';
import sessionRouter from './routes/sessions.routes.js';
import { __dirname } from './path.js';
//import multer from 'multer';
import { engine } from 'express-handlebars';
import * as path from 'path';



//Configuraciones de Express
export const app = express();
const port = process.env.PORT;


// //Configuracion de Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'src/public/img')
//     },
//     filename: (req, file, cb)=>{
//         cb(null, file.originalname)
//     }
// })


//Configuracion de Handlebars
app.engine('handlebars', engine());//Voy a trabajar con handlebars
app.set('view engine', 'handlebars');//Mis vistas son de tipo handlebars
app.set('views', path.resolve(__dirname, "./views"));//src/views


//Middleware
app.use(express.json());//Permite que el servidor entienda los datos enviados en formato json
app.use(express.urlencoded({ extended: true }));//Permite poder usar Query Strings
app.use(session({ //sessions en mongo atlas
    store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB_ATLAS,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 300,// 5 minutos
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
//const upload = multer({storage: storage})//metodo de multer para subir archivos


//Conexion a MongoDB Atlas
mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(error => console.log(error));

//Escuchar Servidor
const httpserver=app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//ServerIO (WebSockets)
const io= new Server(httpserver,{cors:{origin:'*'}});
app.use((req, res, next) => {//Uso de Socket.io en rutas
    req.io = io;
    return next();
  });


//Routes
app.use('/api/products', express.static(__dirname +'/public'))
app.use('/api/carts', express.static(__dirname +'/public'))
app.use('/chat', express.static(__dirname +'/public'))
//app.use('/', express.static(__dirname +'/public'))

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/', sessionRouter);
//app.use('/', homeRouter);


