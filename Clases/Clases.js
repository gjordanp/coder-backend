export class Pokemon {
  constructor(id, nombre, tipo, vida, ataque) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.vida = vida;
    this.ataque = ataque;
    this.nivel = 1;
  }
  saludar() {
    console.log(`Hola, mi nombre es ${this.nombre} y te estoy saludando`);
  }
}

export class Pikachu extends Pokemon {
  //hereda de la clase Pokemon
  constructor(id, nombre, tipo, vida, ataque, dañoImpactrueno) {
    super(id, nombre, tipo, vida, ataque); //llama al constructor de la clase padre
    this.dañoImpactrueno = dañoImpactrueno;
  }
  impactrueno() {
    console.log(
      `${this.nombre} ataca con Impactrueno con ${this.dañoImpactrueno} de daño`
    );
  }
}

//export default Pikachu; //exporta con un solo elemento a exportar