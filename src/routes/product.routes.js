import { Router } from "express";
import {
  getMockProducts,
  seedProducts,
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  realTimeProducts,
} from "../controllers/product.controller.js";
import authz from "../middlewares/autorization.js";

const productRouter = Router(); //Router para manejo de rutas

productRouter.get("/seedproducts", seedProducts);

productRouter.get("/", getProducts);

productRouter.post("/", authz("admin", "premium"), addProduct);

productRouter.get("/mockingproducts", getMockProducts);

productRouter.get("/realtimeproducts", authz("admin"), realTimeProducts);

productRouter.get("/:pid", getProductById);

productRouter.put("/:pid", authz("admin", "premium"), updateProduct);

productRouter.delete("/:pid", authz("admin", "premium"), deleteProduct);

export default productRouter;
