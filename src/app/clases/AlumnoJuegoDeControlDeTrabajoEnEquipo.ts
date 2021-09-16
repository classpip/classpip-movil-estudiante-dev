export class AlumnoJuegoDeControlDeTrabajoEnEquipo {

  alumnoId: number;
  juegoDeControlDeTrabajoEnEquipoId: number;
  respuestas: object[];
  id: number;
  

  constructor(alumnoId?: number, juegoDeControlDeTrabajoEnEquipoId?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeControlDeTrabajoEnEquipoId = juegoDeControlDeTrabajoEnEquipoId;
    this.respuestas = undefined;

  }
}
