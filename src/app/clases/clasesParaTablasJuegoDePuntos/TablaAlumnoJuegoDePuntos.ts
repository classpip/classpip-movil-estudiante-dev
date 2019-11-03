export class TablaAlumnoJuegoDePuntos {

  posicion: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  puntos: number;
  nivel: string;

  constructor(posicion?: number, nombre?: string, primerApellido?: string, segundoApellido?: string, puntos?: number, nivel?: string) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
    this.puntos = puntos;
    this.nivel = nivel;
  }
}
