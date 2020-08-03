export class AlumnoJuegoDeGeocaching {
    
  alumnoId: number;
  juegoDeGeocachingId: number;
  id: number;
  Puntuacion: number;
  Etapa: number;

  constructor(alumnoId?: number, juegoDeGeocachingId?: number, Puntuacion?: number, Etapa?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeGeocachingId = juegoDeGeocachingId;
    this.Puntuacion = Puntuacion;
    this.Etapa = Etapa;

  }
}
