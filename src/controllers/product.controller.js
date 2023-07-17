import { ProductManager, Product } from "../persistencia/DAOs/fileDao/ProductManager.js";
import productService from "../services/product.service.js";
const port = process.env.PORT;

export const seedProducts = async (req, res) => {
  try {
    const productManager = new ProductManager("../persistencia/DAOs/fileDao/productsSeed.txt");
    const seedProducts = await productManager.getProducts();
    //console.log(seedProducts);
    await productService.insertMany(seedProducts);
    res.status(200).send(await productService.findAll());
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};

export const getProducts = async (req, res) => {
  try {
    //Si no existe una session redireccionamos al login
    if (!req.session.user) {
      res.redirect("/");
    } else {
      //const products = await productModel.find().lean(); //obtenemos los productos
      const { limit, page, sort, query } = req.query; //obtenemos el query limit page sort y query
      const objQuery = query != undefined ? JSON.parse(query) : undefined; //query debe escribisrse en formato JSON en URL {"category":"kites","status":"true"}
      //console.log(objQuery);
      const queryFail =
        query != undefined
          ? Object.keys(objQuery).some((key) => {
            return key != "category" && key != "status";
          })
          : undefined;
      //console.log(queryFail);

      let paginatedProducts = await productService.paginate(
        //Primer parametro: filtro
        objQuery ?? {},

        //Segundo parametro: opciones
        {
          limit: limit ?? 10,
          page: page ?? 1,
          sort: { price: sort },
          lean: true,
        } //Lean es para formato de objeto
      );
      const limitString = limit != undefined ? `limit=${limit}&` : "";
      const sortString = sort != undefined ? `sort=${sort}&` : "";
      const queryString = query != undefined ? `query=${query}&` : "";

      paginatedProducts.prevLink = paginatedProducts.hasPrevPage
        ? `http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.prevPage}`
        : "";
      paginatedProducts.nextLink = paginatedProducts.hasNextPage
        ? `http://localhost:${port}/api/products?${limitString}${sortString}${queryString}page=${paginatedProducts.nextPage}`
        : "";
      paginatedProducts = {
        status: !(page <= 0 || page > paginatedProducts.totalPages)
          ? "success"
          : "error",
        ...paginatedProducts,
      };

      if (queryFail) {
        res.status(400)
          .send(`ERROR: en query se debe especificar category o status o ambos en formato JSON 
                        </br>ejemplos: </br>query={\"category\":\"kites\"} 
                        </br>query={\"status\":\"true\"}
                        </br>query={\"category\":\"kites\",\"status\":\"true\"}`);
      } else {
        //res.send(paginatedProducts); //enviamos los productos
        res.status(200).render("products", {
          pagProducts: paginatedProducts,
          user: req.session.user,
        });
      }
    }
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productService.findById(pid); //obtenemos los productos
    res.status(200).send(product); //enviamos los productos
  } catch (error) {
    //res.send("ERROR: " + error.message);
    res.status(500).send(error.message);
  }
};

export const addProduct = async (req, res) => {
  try {
    const {title,description,thumbnails,price,code,stock,status,category,} = req.body; //Consulto los datos enviados por postman
    if (!title ||!description ||!code ||!price ||!status ||!category ||!stock) {
      //Si no hay datos
      res.status(401).send("El producto no contiene todos los datos requeridos");
    } else {
      res.status(200).send(await productService.create(req.body));
    }
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    const updatedObject = req.body; //Consulto los datos enviados por postman
    res.status(200).send(await productService.findByIdAndUpdate(pid, updatedObject)); //return implicito
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pid = req.params.pid; //Consulto el id enviado por la url
    res.status(200).send(await productService.delete(pid));
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};

export const realTimeProducts = async (req, res) => {
  const io = req.io;

  //Conexion a socket.io
  io.on("connection", async (socket) => {
    //cuando se establece la conexion envio un mensaje
    console.log("Cliente conectado a RealTimeProducts");

    //Onload
    socket.emit("server:onloadProducts", await productService.findAll());
    //NewProduct
    socket.on("client:newproduct", (data) => {
      newProduct(data);
    });
    //DeleteProduct
    socket.on("client:deleteProduct", (id) => {
      deleteProduct(id);
    });

    const newProduct = async (data) => {
      const newProduct = new Product(
        data.title,
        data.description,
        data.thumbnails,
        data.price,
        data.code,
        data.stock,
        data.status,
        data.category
      );
      await productService.create(newProduct);
      const updatedProducts = await productService.findAll();
      socket.emit("server:updatedProducts", updatedProducts);
    };

    const deleteProduct = async (id) => {
      await productService.delete(id);
      const updatedProducts = await productService.findAll();
      socket.emit("server:updatedProducts", updatedProducts);
    };
  });

  //Render
  try {
    const products = await productService.findAll(); //obtenemos los productos
    //const products = await productModel.paginate({}, { limit: 10, page: 1, sort: { price: 1 }, lean: true})
    res.status(200).render("realtimeproducts", { products: products });
  } catch (error) {
    res.status(500).send("ERROR: " + error);
  }
};
