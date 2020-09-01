export class AlumnoJuegoDeVotacionUnoATodos {

    PuntosTotales: number;
    id: number;
    alumnoId: number;
    juegoDeVotacionUnoATodosId: number;
    Votos: number[];
  
    constructor(alumnoId?: number, juegoDeVotacionUnoATodosId?: number) {
  
      this.alumnoId = alumnoId;
      this.juegoDeVotacionUnoATodosId = juegoDeVotacionUnoATodosId;
    }
  }
  