export class EquipoJuegoDePuntos {

  PuntosTotalesEquipo: number;
  equipoId: number;
  juegoDePuntosId: number;
  id: number;
  nivelId: number;

  constructor(equipoId?: number, juegoDePuntosId?: number, PuntosTotalesEquipo?: number, nivelId?: number) {

    this.equipoId = equipoId;
    this.juegoDePuntosId = juegoDePuntosId;
    this.nivelId = nivelId;
    this.PuntosTotalesEquipo = PuntosTotalesEquipo;

  }
}
