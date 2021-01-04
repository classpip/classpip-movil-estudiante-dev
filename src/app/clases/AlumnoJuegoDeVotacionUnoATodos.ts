export class AlumnoJuegoDeVotacionUnoATodos {

    PuntosTotales: number;
    id: number;
    alumnoId: number;
    juegoDeVotacionUnoATodosId: number;
    Votos: any[];
  
    constructor(alumnoId?: number, juegoDeVotacionUnoATodosId?: number) {
  
      this.alumnoId = alumnoId;
      this.juegoDeVotacionUnoATodosId = juegoDeVotacionUnoATodosId;
    }
  }
  