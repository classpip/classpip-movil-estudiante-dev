export class Jornada {
  Fecha: Date;
  CriterioGanador: string;
  JuegoDeCompeticionLigaId: number;
  GanadoresFormulaUno: number[];
  id: number;

  constructor(Fecha?: Date, CriterioGanador?: string, JuegoDeCompeticionId?: number, GanadoresFormulaUno?: number[]) {

    this.Fecha = Fecha;
    this.CriterioGanador = CriterioGanador;
    this.JuegoDeCompeticionLigaId = JuegoDeCompeticionId;
    this.GanadoresFormulaUno = GanadoresFormulaUno;
  }
}
