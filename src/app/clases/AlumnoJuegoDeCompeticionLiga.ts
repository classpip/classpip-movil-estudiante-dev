export class AlumnoJuegoDeCompeticionLiga {

  PuntosTotalesAlumno: number;
  id: number;
  AlumnoId: number;
  JuegoDeCompeticionLigaId: number;

  constructor(AlumnoId?: number, JuegoDeCompeticionLigaId?: number, PuntosTotalesAlumno?: number, id?: number) {

    this.PuntosTotalesAlumno = PuntosTotalesAlumno;
    this.id = id;
    this.AlumnoId = AlumnoId;
    this.JuegoDeCompeticionLigaId = JuegoDeCompeticionLigaId;

  }
}

  