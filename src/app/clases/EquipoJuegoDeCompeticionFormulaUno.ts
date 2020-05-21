export class EquipoJuegoDeCompeticionFormulaUno {

    PuntosTotalesEquipo: number;
    EquipoId: number;
    JuegoDeCompeticionFormulaUnoId: number;
    id: number;
  
    constructor(EquipoId?: number, JuegoDeCompeticionFormulaUnoId?: number, PuntosTotalesEquipo?: number, id?: number) {
  
      this.EquipoId = EquipoId;
      this.JuegoDeCompeticionFormulaUnoId = JuegoDeCompeticionFormulaUnoId;
      this.PuntosTotalesEquipo = PuntosTotalesEquipo;
      this.id = id;
    }
  }
  