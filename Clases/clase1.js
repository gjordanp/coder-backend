//funcion normal
function sumar(num1, num2) {
  return num1 + num2;
}

//funcion anonima
const sumar2 = function (num1, num2) {
  return num1 + num2;
};

//funcion flecha
const sumar3 = (num1, num2) => {
  return num1 + num2;
};
console.log(sumar(2, 3));
console.log(sumar2(2, 3));
console.log(sumar3(2, 3));


import {Pikachu, Pokemon} from "./Clases.js"; //usar {} cuando se exporta mas de un elemento y sin {} cuando se exporta un solo elemento
//para permitir Exportacion e Importacion de modulos en el navegador se debe agregar type="module" en package.json
// tambien es posible usar Exportacion e Importacion en HTML con type="module" en script <script type="module" src="index.js"></script>

const pikachu = new Pokemon(1, "Pikachu", "Electrico", 100, 55);
const charmander = new Pokemon(2, "Charmander", "Fuego", 100, 52);
const squirtle = new Pokemon(3, "Squirtle", "Agua", 100, 48);

console.log(pikachu);
console.log(charmander);
console.log(squirtle);

pikachu.saludar();
charmander.saludar();
squirtle.saludar();


const pikachu2 = new Pikachu(1, "Laucha", "Electrico", 100, 55, 100);
console.log(pikachu2);
pikachu2.impactrueno();
pikachu2.saludar();


