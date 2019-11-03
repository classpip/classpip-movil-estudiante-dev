export class AlumnoJuegoDePuntos {

  PuntosTotalesAlumno: number;
  alumnoId: number;
  juegoDePuntosId: number;
  id: number;
  nivelId: number;

  constructor(alumnoId?: number, juegoDePuntosId?: number, PuntosTotalesAlumno?: number, nivelId?: number) {

    this.alumnoId = alumnoId;
    this.juegoDePuntosId = juegoDePuntosId;
    this.nivelId = nivelId;
    this.PuntosTotalesAlumno = PuntosTotalesAlumno;

  }
}

