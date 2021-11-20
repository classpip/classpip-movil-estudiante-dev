export class AlumnoJuegoDeVotacionAOpciones {

  id: number;
  alumnoId: number;
  juegoDeVotacionAOpcionesId: number;
  Votos: any[];

  constructor(alumnoId?: number, juegoDeVotacionAOpcionesId?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeVotacionAOpcionesId = juegoDeVotacionAOpcionesId;
  }
}
