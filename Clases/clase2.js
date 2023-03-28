// Ecma7

//exponencial
console.log(Math.pow(5, 3));
console.log(25 ** 0.5);

//includes
const nombres = ["Juan", "Pedro", "Maria", "Jose", "Luis", "Maria", "Maria"];
console.log(nombres.includes("Maria"));
console.log(nombres.includes("Gabriel"));

// Ecma8
const libro = {
  nombre: "El señor de los anillos",
  autor: "J.R.R. Tolkien",
  paginas: 1000,
  precio: 1200,
  editorial: "Minotauro",
  año: 1954,
  stock: 10,
};

console.log(Object.entries(libro)); //retorna un array con los valores y llaves del objeto
console.log(Object.values(libro)); //retorna un array con los valores del objeto
console.log(Object.keys(libro)); //retorna un array con las llaves del objeto

//Ecma9
const libro2 = { ...libro }; //copia de objeto para objetos no complejos, para objetos complejos se debe usar structuredClone()
console.log(libro2);

function sumar(...num) {
  //operador rest => referencia a n cantidad de argumentos
  return num.reduce((acc, el) => acc + el, 0);
}

console.log(sumar(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
console.log(sumar(1, 10));
console.log(sumar(1, 10, 100));
console.log(sumar(1, 10, 100, 1000));

//Ecma10
const nombre = " Juan";
console.log(nombre);
console.log(nombre.trim()); //elimina espacios en blanco al inicio y al final de un string

const facturas = [100, 200, [500, 600, [200, 600]], 400, 500];
console.log(facturas);
console.log(facturas.flat()); //devuelve un nuevo array con los elementos del array original y los elementos de los subarrays, por defecto es 1
console.log(facturas.flat(1));
console.log(facturas.flat(2));

//DYNAMIC IMPORT
//import {} from "module" //importar modulos
const user = true;
if (user) {
  const config = import("./clase2.js"); //esto
} else {
  // Enviar mensaje de login invalido
}

//Ecma11

//-Nullish coalescing operator
const sueldos = [100, 200, undefined, 1000];

//si es null o undefined retorna 0
console.log(sueldos.map((num) => num ?? 0).reduce((acc, el) => acc + el, 0));

//Ecma12

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
    this.id=null;
  }
}

class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(product) {
    this.products.push(product);
    this.id=this.products.length;
  }

  getProduct(code) {
    return this.products.find((el) => el.code == code);
  }

  getProducts() {
    return this.products;
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
