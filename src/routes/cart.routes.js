import {Router} from 'express';
import {CartManager} from '../CartManager.js';

const cartManager = new CartManager('./src/carts.txt','./src/products.txt');
const cartRouter = Router(); //Router para manejo de rutas

cartRouter.get('/:cid', async (req, res) => {
    const cid= req.params.cid
    const cart=await cartManager.getCartById(cid);//obtenemos los productos
    res.send(cart.products??cart);//enviamos los productos
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid= req.params.cid;
    const pid= req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    res.send(await cartManager.addProduct(cid,pid,quantity))
})

export default cartRouter;