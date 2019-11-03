export class TablaEquipoJuegoDePuntos {

  posicion: number;
  nombre: string;
  puntos: number;
  nivel: string;
  id: number;

  constructor(posicion?: number, nombre?: string, id?: number, puntos?: number, nivel?: string) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.puntos = puntos;
    this.nivel = nivel;
    this.id = id;
  }
}
