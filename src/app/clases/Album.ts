export class Album {
  alumnoJuegoDeColeccionId: number;
  cromoId: number;
  Fecha: string;
  id: number;

  constructor(alumnoJuegoDeColeccionId?: number, cromoId?: number, Fecha?: string) {

    this.alumnoJuegoDeColeccionId = alumnoJuegoDeColeccionId;
    this.cromoId = cromoId;
    this.Fecha = Fecha;
  }
}
