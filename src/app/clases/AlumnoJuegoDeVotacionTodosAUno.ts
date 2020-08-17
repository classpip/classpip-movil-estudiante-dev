export class AlumnoJuegoDeVotacionTodosAUno {

  PuntosTotales: number;
  id: number;
  alumnoId: number;
  juegoDeVotacionUnoATodosId: number;
  VotosEmitidos: any[];
  VotosRecibidos: any[];

  constructor(alumnoId?: number, juegoDeVotacionUnoATodosId?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeVotacionUnoATodosId = juegoDeVotacionUnoATodosId;
    this.PuntosTotales = 0;
    this.VotosEmitidos = [];
    this.VotosRecibidos = [];
  }
}
