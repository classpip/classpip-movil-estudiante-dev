export class MiEquipoAMostrarJuegoDePuntos {

  PuntosTotalesEquipo: number;
  juegoDePuntosId: number;
  id: number;
  // nivelId: number;
  Nombre: string;
  FotoEquipo: string;
  grupoId: number;

  constructor(juegoDePuntosId?: number, PuntosTotalesEquipo?: number,
              id?: number, Nombre?: string, grupoId?: number, FotoEquipo?: string) {

    this.juegoDePuntosId = juegoDePuntosId;
    this.id = id;
    this.PuntosTotalesEquipo = PuntosTotalesEquipo;
    this.Nombre = Nombre;
    this.FotoEquipo = FotoEquipo;
    this.grupoId = grupoId;

  }
}

