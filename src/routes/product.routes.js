import { Router } from "express";
import { ProductManager, Product } from "../ProductManager.js";
import productModel from "../models/Products.js";


const productRouter = Router(); //Router para manejo de rutas
const port = process.env.PORT;

//FS -------------------------------------------------------------------------------------------

// const productManager = new ProductManager("./src/products.txt");
// productRouter.get("/", async (req, res) => {
//   const products = await productManager.getProducts(); //obtenemos los productos
//   const { limit } = req.query; //obtenemos el query limit
//   if (limit) {
//     products.splice(limit);
//   } //si existe limit, lo aplicamos
//   //res.send(products); //enviamos los productos
//   res.render('home', { products: products })
// });

// productRouter.get("/realtimeproducts", async (req, res) => {
//   const products = await productManager.getProducts(); //obtenemos los productos
//   //res.send(products); //enviamos los productos
//   req.io.sockets.on('new-product', (data) => {
//     console.log(data);
//     const newProduct = new Product(data.title, data.description, data.thumbnails, data.price, data.code, data.stock, data.status, data.category)
//     console.log(newProduct);
//     productManager.addProduct(newProduct);
//     const updatedProducts=productManager.getProducts();
//     socket.emit('updated-products', updatedProducts);
//   })
//   res.render('realTimeProducts', { products: products })

// });

// productRouter.get("/:pid", async (req, res) => {
//   const pid = req.params.pid;
//   const product = await productManager.getProductById(pid); //obtenemos los productos
//   res.send(product); //enviamos los productos
// });

// productRouter.post("/", async (req, res) => {
//   const products = await productManager.getProducts(); //obtenemos los productos
//   const { title, description, thumbnails, price, code, stock, status, category } = req.body; //Consulto los datos enviados por postman
//   if (!title || !description || !code || !price || !status || !category || !stock) {
//     //Si no hay datos
//     res.send("El producto no contiene todos los datos requeridos");
//   } else {
//     const newProduct = new Product(title, description, thumbnails, price, code, stock, status, category)
//     res.send(await productManager.addProduct(newProduct)); //return implicito
//   }
// });

// productRouter.put("/:pid", async (req, res) => {
//   const pid = parseInt(req.params.pid); //Consulto el id enviado por la url
//   const { title, description, thumbnails, price, code, stock, status, category } = req.body; //Consulto los datos enviados por postman
//   const updatedObject = { title: title, description: description, thumbnails: thumbnails, price: price, code: code, stock: stock, status: status, category: category }
//   res.send(await productManager.updateProduct(pid, updatedObject)); //return implicito
// });

// productRouter.delete("/:pid", async (req, res) => {
//   const pid = parseInt(req.params.pid); //Consulto el id enviado por la url
//   res.send(await productManager.deleteProduct(pid));
// });


//MONGO -------------------------------------------------------------------------------------------

productRouter.get("/seedproducts", async (req, res) => {
  const productManager = new ProductManager("./src/productsSeed.txt");
  const seedProducts= await productManager.getProducts();
  //console.log(seedProducts);
  await productModel.insertMany(seedProducts);
  res.send(await productModel.find());
});

productRouter.get("/", async (req, res) => {
  try {
    
    //Si no existe una session redireccionamos al login
    if (!req.session.user) {
      res.redirect("/");
    }

    //const products = await productModel.find().lean(); //obtenemos los productos
    const { limit, page, sort, query } = req.query; //obtenemos el query limit page sort y query
    const objQuery = query!=undefined?JSON.parse(query):undefined;//query debe escribisrse en formato JSON en URL {"category":"kites","status":"true"}
    //console.log(objQuery);
    const queryFail=query!=undefined?Object.keys(objQuery).some(key => {return (key != "category" && key != "status")}):undefined;
    //console.log(queryFail);

    let paginatedProducts = await productModel.paginate(
      //Primer parametro: filtro
      objQuery??{},

      //Segundo parametro: opciones
      {limit: limit??10, page: page??1, sort: {price: sort}, lean: true}//Lean es para formato de objeto
      
    );    
    const limitString=limit!=undefined?`limit=${limit}&`:'';
    const sortString=sort!=undefined?`sort=${sort}&`:'';
    const queryString=query!=undefined?`query=${query}&`:'';

    paginatedProducts.prevLink = paginatedProducts.hasPrevPage?`http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.prevPage}`:'';
    paginatedProducts.nextLink = paginatedProducts.hasNextPage?`http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.nextPage}`:'';
    paginatedProducts={"status":(!(page<=0||page>paginatedProducts.totalPages))?"success": "error",...paginatedProducts};


    if (queryFail){
      res.status(400).send(`ERROR: en query se debe especificar category o status o ambos en formato JSON 
      </br>ejemplos: </br>query={\"category\":\"kites\"} 
      </br>query={\"status\":\"true\"}
      </br>query={\"category\":\"kites\",\"status\":\"true\"}`);
    }
    else{
      //res.send(paginatedProducts); //enviamos los productos
      res.render("products", { pagProducts: paginatedProducts , user: req.session.user });
    }

  } catch (error) {
    res.send("ERROR: " + error);
  }
});


productRouter.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productModel.findById(pid); //obtenemos los productos
    res.send(product); //enviamos los productos
  } catch (error) {
    res.send("ERROR: " + error);
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const { title, description, thumbnails, price, code, stock, status, category, } = req.body; //Consulto los datos enviados por postman
    if (!title || !description || !code || !price || !status || !category || !stock) {
      //Si no hay datos
      res.send("El producto no contiene todos los datos requeridos");
    } else {
      const newProduct = new Product(title, description, thumbnails, price, code, stock, status, category);
      res.send(await productModel.create(newProduct));
    }
  } catch (error) {
    res.send("ERROR: " + error);
  }

});

productRouter.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    const { title, description, thumbnails, price, code, stock, status, category } = req.body; //Consulto los datos enviados por postman
    const updatedObject = { title: title, description: description, thumbnails: thumbnails, price: price, code: code, stock: stock, status: status, category: category };
    res.send(await productModel.findByIdAndUpdate(pid, updatedObject)); //return implicito
  } catch (error) {
    res.send("ERROR: " + error);
  }

});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    res.send(await productModel.findByIdAndDelete(pid));
  } catch (error) {
    res.send("ERROR: " + error);
  }
});


productRouter.get("/realtimeproducts", async (req, res) => {
  const io = req.io;
  console.log("hola");

  //Conexion a socket.io
  io.on('connection', async (socket) => {//cuando se establece la conexion envio un mensaje
    console.log('Cliente conectado a RealTimeProducts');

    //Onload
    socket.emit('server:onloadProducts', await productModel.find());
    //NewProduct
    socket.on('client:newproduct', (data) => { newProduct(data) })
    //DeleteProduct
    socket.on('client:deleteProduct', (id) => { deleteProduct(id) })


    const newProduct = async (data) => {
      const newProduct = new Product(data.title, data.description, data.thumbnails, data.price, data.code, data.stock, data.status, data.category)
      await productModel.create(newProduct);
      const updatedProducts = await productModel.find();
      socket.emit('server:updatedProducts', updatedProducts);
    };

    const deleteProduct = async (id) => {
      await productModel.deleteOne({ _id: id });
      const updatedProducts = await productModel.find();
      socket.emit('server:updatedProducts', updatedProducts);
    };

  });

  //Render
  try {
    const products = await productModel.find(); //obtenemos los productos
    console.log(products);
    res.render("realtimeproducts", { products: products });
  } catch (error) {
    res.send("ERROR: " + error);
  }

});

export default productRouter;
