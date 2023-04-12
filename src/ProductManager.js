import { promises as fs } from "fs";

// Desafio 2
export class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    //constructor
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

export class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  static incrementID() {
    if (this.idIncrement) {
      //Existe esta propiedad
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }

  async addProduct(product) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    product.id = ProductManager.incrementID();
    const index = products.findIndex((el) => el.code == product.code);
    if (index == -1) {
      products.push(product);
      //Escribir archivo
      await fs.writeFile(this.path, JSON.stringify(products));
      return products;
    } else {
      return "El producto ya existe";
    }
  }

  async getProducts() {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    return products;
  }

  async getProductById(id) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const product = products.find((el) => el.id == id);
    return product ?? "Not found";
  }

  async updateProduct(id, obj) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((el) => el.id == id);
    if (index !== -1) {
    //reemplazamos el objeto en el array
    products[index].title=obj.title;
    products[index].description=obj.description;
    products[index].price=obj.price;
    products[index].thumbnail=obj.thumbnail;
    products[index].code=obj.code;
    products[index].stock=obj.stock;
    //Escribir archivo
    await fs.writeFile(this.path, JSON.stringify(products));
    return products
    }
    return console.log("Not Found");
  }

  async deleteProduct(id) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((el) => el.id == id);
    if (index !== -1) {
    //Eliminamos el objeto en el array
    products.splice(index, 1);
    //Escribir archivo
    await fs.writeFile(this.path, JSON.stringify(products));
    return products;
    }
    return console.log("Not Found");
  }
}

// const producto1 = new Product(
//   "Producto1",
//   "Desc producto 1",
//   200,
//   "Sin imagen",
//   "abc123",
//   25
// );
// const producto2 = new Product(
//   "Producto2",
//   "Desc producto 2",
//   100,
//   "Sin imagen",
//   "def456",
//   15
// );
// const productoeditado = new Product(
//     "ProductoEditado",
//     "Desc producto editado",
//     55,
//     "Sin imagen",
//     "dkjnhefr",
//     41
//   );


// //Test del desafio 2  
// const pm = new ProductManager("./info.txt");
// console.log(await pm.getProducts());
// await pm.addProduct(producto1);
// await pm.addProduct(producto2);
// console.log(await pm.getProducts());
// console.log(await pm.getProductById(1));
// console.log(await pm.getProductById(3));
// await pm.updateProduct(1, productoeditado);
// console.log(await pm.getProducts());
// await pm.deleteProduct(1);
// console.log(await pm.getProducts());
// await pm.deleteProduct(2);
// console.log(await pm.getProducts());
// await pm.deleteProduct(2);


