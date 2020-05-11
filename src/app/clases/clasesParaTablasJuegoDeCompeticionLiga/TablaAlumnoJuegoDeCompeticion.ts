export class TablaAlumnoJuegoDeCompeticion {

  posicion: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  puntos: number;
  id: number;
  partidosTotales: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;

  constructor(posicion?: number, nombre?: string, primerApellido?: string, segundoApellido?: string,
              puntos?: number, id?: number, partidosTotales?: number, partidosJugados?: number,
              partidosGanador?: number, partidosEmpatados?: number, partidosPerdidos?: number) {

    this.posicion = posicion;
    this.nombre = nombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
    this.puntos = puntos;
    this.id = id;
    this.partidosTotales = partidosTotales;
    this.partidosJugados = partidosJugados;
    this.partidosGanados = partidosGanador;
    this.partidosEmpatados = partidosEmpatados;
    this.partidosPerdidos = partidosPerdidos;
  }
}
