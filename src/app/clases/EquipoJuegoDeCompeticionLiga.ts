export class EquipoJuegoDeCompeticionLiga {

    PuntosTotalesEquipo: number;
    EquipoId: number;
    JuegoDeCompeticionLigaId: number;
    id: number;
  
    constructor(EquipoId?: number, JuegoDeCompeticionLigaId?: number, PuntosTotalesEquipo?: number, id?: number) {
  
      this.EquipoId = EquipoId;
      this.JuegoDeCompeticionLigaId = JuegoDeCompeticionLigaId;
      this.PuntosTotalesEquipo = PuntosTotalesEquipo;
      this.id = id;
    }
  }
  