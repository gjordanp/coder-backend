import { ProductManager } from './ProductManager.js';  
import express from 'express';
const app = express();
const port = 8080;
app.use(express.urlencoded({ extended: true }));//Para usar querys en request

const pm = new ProductManager("./src/info.txt");

app.get('/', async (req, res) => {
    res.send("Desafio 3 Gabriel Jordán");
});

app.get('/products/:pid', async (req, res) => {
    const product=await pm.getProductById(req.params.pid);//obtenemos el producto segun pid
    res.send(product);//enviamos los productos
});

app.get('/products', async (req, res) => {
    const products=await pm.getProducts();//obtenemos los productos
    const {limit}=req.query;//obtenemos el query limit
    if(limit){products.splice(limit)}//si existe limit, lo aplicamos
    res.send(products);//enviamos los productos
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});