import { Router } from 'express';
//import { CartManager } from '../CartManager.js';
import { addProductOnCart, createCart, deleteCart, deleteProductOnCart, getCartById, getCarts, updateProductOnCart, updateProductQuantityOnCart } from '../controllers/cart.controller.js';


const cartRouter = Router(); //Router para manejo de rutas

//FS -------------------------------------------------------------------------------------------
// const cartManager = new CartManager('./src/carts.txt', './src/products.txt');
// cartRouter.get('/:cid', async (req, res) => {
//     const cid= req.params.cid
//     const cart=await cartManager.getCartById(cid);//obtenemos los productos
//     res.send(cart.products??cart);//enviamos los productos
// });

// cartRouter.post("/:cid/product/:pid", async (req, res) => {
//     const cid= req.params.cid;
//     const pid= req.params.pid;
//     const { quantity } = req.body //Consulto el dato quantity enviado por postman
//     res.send(await cartManager.addProduct(cid,pid,quantity))
// })


//MONGO -------------------------------------------------------------------------------------------
cartRouter.get('/createcart', createCart);

cartRouter.get('/', getCarts);

cartRouter.get('/:cid', getCartById);

cartRouter.post("/:cid/product/:pid", addProductOnCart)

cartRouter.delete("/:cid/product/:pid", deleteProductOnCart);

cartRouter.delete("/:cid", deleteCart);

cartRouter.put("/:cid", updateProductOnCart);

cartRouter.put("/:cid/product/:pid", updateProductQuantityOnCart)

//Otras Rutas
cartRouter.put("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});
cartRouter.get("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});
cartRouter.post("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});
cartRouter.delete("*", async (req, res) => {
    res.send("Error: Ruta incorrecta");
});

export default cartRouter;