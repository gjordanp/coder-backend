import { Router } from "express";
import { seedProducts, getProducts, getProductById, addProduct, updateProduct, deleteProduct, realTimeProducts } from "../controllers/product.controller.js";
import autorization from "../middlewares/autorization.js";

const productRouter = Router(); //Router para manejo de rutas

productRouter.get("/seedproducts", seedProducts);

productRouter.get("/", getProducts);

productRouter.get("/realtimeproducts", realTimeProducts);

productRouter.get("/:pid", getProductById);

productRouter.post("/", autorization('admin'), addProduct);

productRouter.put("/:pid", autorization('admin'), updateProduct);

productRouter.delete("/:pid", autorization('admin'), deleteProduct);

export default productRouter;
