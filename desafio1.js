

// Desafio 1

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        //constructor
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = null;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        product.id=this.products.length+1;
        const index = this.products.findIndex((el) => el.code == product.code);
        return (index == -1)? this.products.push(product): "El producto ya existe";
    }

    getProduct(code) {
        return this.products.find((el) => el.code == code);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((el) => el.id == id);
        return product??"Not found";
    }
    

    updateProduct(code, product) {
        const index = this.products.findIndex((el) => el.code == code);
        this.products[index] = product;
    }

    deleteProduct(code) {
        const index = this.products.findIndex((el) => el.code == code);
        this.products.splice(index, 1);
    }
}

const pm= new ProductManager();
console.log(pm.getProducts())

pm.addProduct(new Product("producto prueba", "Este es un producto prueba",200,"Sin imagen", "abc123", 25));

console.log(pm.getProducts())

console.log(pm.getProductById(1))
console.log(pm.addProduct(new Product("producto prueba", "Este es un producto prueba",200,"Sin imagen", "abc123", 25)));
console.log(pm.getProductById(2));

