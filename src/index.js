import {Server} from 'socket.io';
import express from 'express';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { __dirname } from './path.js';
//import multer from 'multer';
import { engine } from 'express-handlebars';
import * as path from 'path';

import { ProductManager, Product } from './ProductManager.js';


//Configuraciones de Express
export const app = express();
const port = 8080;


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
//const upload = multer({storage: storage})//metodo de multer para subir archivos








//Escuchar Servidor
const server=app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//ServerIO (WebSockets)
const io= new Server(server);
const newProduct=null;

io.on('connection', (socket)=>{//cuando se establece la conexion envio un mensaje
    console.log('Cliente conectado');
    socket.on('client:newproduct', async (data) => {
        const productManager = new ProductManager('./src/products.txt');
        const newProduct = new Product(data.title, data.description, data.thumbnails, data.price, data.code, data.stock, data.status, data.category)
        await productManager.addProduct(newProduct);
        const updatedProducts= await productManager.getProducts();
        socket.emit('server:updatedProducts', updatedProducts);
      })
}) 

app.use(async(req, res, next) => {
    req.io = io;
    return next();
  });

//Routes
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', express.static(__dirname +'/public'))
// app.post('/upload', upload.single('product'), (req, res) => {
//     //Imagenes
//     console.log(req.body);
//     console.log(req.file);
//     res.send('Imagen subida')
// })

// app.get('/realtimeproducts', async (req, res) => {
//     res.render('realTimeProducts', {})
// })
