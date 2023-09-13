import { Server } from 'socket.io';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import './persistencia/mongoDB/configMongo.js';
import MongoStore from 'connect-mongo'; //Sessiones en Mongo
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import chatRouter from './routes/chat.routes.js';
import homeRouter from './routes/home.routes.js';
import sessionRouter from './routes/sessions.routes.js';
import userRouter from './routes/user.routes.js';
import paymentRouter from './routes/payment.routes.js';
import { __dirname } from './utils/path.js';
import { engine } from 'express-handlebars';
import * as path from 'path';
import compression from 'express-compression';
import errorHandler from './middlewares/errors.js';
import { addLogger } from './utils/logger.js';

import { serveSwagger, setupSwagger } from './utils/swagger.js';



//Configuraciones de Express
export const app = express();
const port = process.env.PORT;


//Configuracion de Handlebars
app.engine('handlebars', engine(
  //helper for slice string
  {
    helpers: {
      first: function (string) {
        return string.slice(0, 1);
      },
      findProfileImg: function (documents) {
        const docs=documents;
        const doc=docs.find(doc => doc.name == "profileImg")
        return doc.reference;
      },
      eq: function (v1, v2) {
        return v1 === v2;
      },
      neq: function (v1, v2) {
        return v1 !== v2;
      },
      cartTotal: function (cart) {
        let total = 0;
        cart.products.forEach(element => {
          total += element.id_prod.price * element.quantity;
        });
        return total;
      }
    }
  }
));//Voy a trabajar con handlebars
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
  saveUninitialized: false //Evita guardar sesiones vacias
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(compression({brotli:{enabled: true, zlib: {}},}));//Comprimir response con Brotli
app.use(addLogger);//Agrego logger a request


//Escuchar Servidor
const httpserver = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

//ServerIO (WebSockets)
const io = new Server(httpserver, { cors: { origin: '*' } });
app.use((req, res, next) => {//Uso de Socket.io en rutas
  req.io = io;
  return next();
});


//Routes
app.use('/api/payments/success/', express.static(__dirname + '/public')) //usar carpeta public en ruta /api/products
app.use('/api/users/edit/', express.static(__dirname + '/public')) //usar carpeta public en ruta /api/products
app.use('/api/products/realtimeproducts/', express.static(__dirname + '/public')) //usar carpeta public en ruta /api/products
app.use('/api/sessions/profile/', express.static(__dirname + '/public')) //usar carpeta public en ruta /api/products
app.use('/api/products/', express.static(__dirname + '/public')) //usar carpeta public en ruta /api/products
app.use('/api/carts/', express.static(__dirname + '/public'))
app.use('/chat/', express.static(__dirname + '/public'))
app.use('/', express.static(__dirname + '/public'))


app.use('/api/payments', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/chat', chatRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', homeRouter);
app.use('/loggerTest', (req, res) => {

  req.logger.debug("Debug");
  req.logger.http("Http");
  req.logger.info("Info");
  req.logger.warning("Warning");
  req.logger.error("Error");
  req.logger.fatal("Fatal");
  res.send("Logger test");
});//Ruta para evitar error 404 en rutas inexistentes

//Ruta para documentacion de API usando Swagger
app.use('/apidocs', serveSwagger, setupSwagger);

//Custom Error Handler
app.use(errorHandler);


