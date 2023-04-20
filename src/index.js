import express from 'express';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import { __dirname } from './path.js';
//import multer from 'multer';

//Configuraciones de Express
const app = express();
const port = 4000;


// //Configuracion de Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'src/public/img')
//     },
//     filename: (req, file, cb)=>{
//         cb(null, file.originalname)
//     }

// })

//Middleware
app.use(express.json());//Permite que el servidor entienda los datos enviados en formato json
app.use(express.urlencoded({ extended: true }));//Permite poder usar Query Strings
//const upload = multer({storage: storage})//metodo de multer para subir archivos

//Routes
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/static', express.static(__dirname +'/public'))
// app.post('/upload', upload.single('product'), (req, res) => {
//     //Imagenes
//     console.log(req.body);
//     console.log(req.file);
//     res.send('Imagen subida')
// })




//Escuchar Servidor
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});