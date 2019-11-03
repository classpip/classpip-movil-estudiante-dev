export class AlbumEquipo {
  equipoJuegoDeColeccionId: number;
  cromoId: number;
  Fecha: string;
  id: number;

  constructor(equipoJuegoDeColeccionId?: number, cromoId?: number, Fecha?: string) {

    this.equipoJuegoDeColeccionId = equipoJuegoDeColeccionId;
    this.cromoId = cromoId;
    this.Fecha = Fecha;
  }
}
