import { Router } from "express";
//import { CartManager } from '../CartManager.js';
import {
    addProductOnCart,
    createCart,
    deleteCart,
    deleteProductOnCart,
    getCartById,
    getCarts,
    updateProductsOnCart,
    updateProductQuantityOnCart,
    purchaseCart,
    checkout,
    checkoutSession,
    deleteProductOnCartAndBackToCart
} from "../controllers/cart.controller.js";
import authz from "../middlewares/autorization.js";
import auth from "../middlewares/authentication.js";

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
cartRouter.get("/createcart", createCart);

cartRouter.get("/", getCarts);

cartRouter.get("/:cid", getCartById);

cartRouter.put("/:cid", auth(), updateProductsOnCart);

cartRouter.delete("/:cid", auth(), authz("admin"), deleteCart);

cartRouter.get("/:cid/purchase", auth(), purchaseCart, checkoutSession);

cartRouter.post("/:cid/product/:pid",auth(), authz("user", "premium"),addProductOnCart);

cartRouter.put("/:cid/product/:pid", auth(), updateProductQuantityOnCart);

cartRouter.delete("/:cid/product/:pid", auth(), deleteProductOnCart);

cartRouter.get("/:cid/product/:pid/delete", auth(), deleteProductOnCartAndBackToCart);

cartRouter.get("/checkout", checkout);

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
