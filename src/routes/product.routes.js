import { Router } from "express";
import { seedProducts, getProducts, getProductById, addProduct, updateProduct, deleteProduct ,realTimeProducts} from "../controllers/product.controller.js";

const productRouter = Router(); //Router para manejo de rutas

productRouter.get("/seedproducts", seedProducts);

productRouter.get("/", getProducts);

productRouter.get("/realtimeproducts", realTimeProducts);

productRouter.get("/:pid", getProductById);

productRouter.post("/", addProduct);

productRouter.put("/:pid", updateProduct);

productRouter.delete("/:pid", deleteProduct);

export default productRouter;
