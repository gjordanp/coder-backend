import { Router } from "express";
import { ProductManager, Product } from "../ProductManager.js";

const productManager = new ProductManager("./src/products.txt");
const productRouter = Router(); //Router para manejo de rutas

productRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts(); //obtenemos los productos
  const { limit } = req.query; //obtenemos el query limit
  if (limit) {
    products.splice(limit);
  } //si existe limit, lo aplicamos
  res.send(products); //enviamos los productos
});

productRouter.get("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid); //obtenemos los productos
  res.send(product); //enviamos los productos
});

productRouter.post("/", async (req, res) => {
  const products = await productManager.getProducts(); //obtenemos los productos
  const {title,description,thumbnails,price,code,stock,status,category} = req.body; //Consulto los datos enviados por postman
  if (!title || !description || !code || !price || !status || !category || !stock) {
    //Si no hay datos
    res.send("El producto no contiene todos los datos requeridos");
  } else {
    const newProduct= new Product(title,description,thumbnails,price,code,stock,status,category)
    res.send(await productManager.addProduct(newProduct)); //return implicito
  }
});

productRouter.put("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid); //Consulto el id enviado por la url
    const {title,description,thumbnails,price,code,stock,status,category} = req.body; //Consulto los datos enviados por postman
    const updatedObject={title:title,description:description,thumbnails:thumbnails,price:price,code:code,stock:stock,status:status,category:category}
    res.send(await productManager.updateProduct(pid,updatedObject)); //return implicito
});

productRouter.delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid); //Consulto el id enviado por la url
    res.send(await productManager.deleteProduct(pid));
});

export default productRouter;
