export class TablaJornadas {

  NumeroDeJornada: number;
  Fecha: any;
  CriterioGanador: string;
  id: number;
  GanadoresFormulaUno: {
    nombre: string[];
    id: number[]
  } = {nombre: undefined, id: undefined};
  Disputada: boolean;

  constructor(NumeroDeJornada?: number, Fecha?: any, CriterioGanador?: string, id?: number, GanadoresFormulaUno?: string[],
              GanadoresFormulaUnoId?: number[], Disputada?: boolean) {

    this.NumeroDeJornada = NumeroDeJornada;
    this.Fecha = Fecha;
    this.CriterioGanador = CriterioGanador;
    this.id = id;
    if (GanadoresFormulaUno !== undefined && GanadoresFormulaUnoId !== undefined) {
      this.GanadoresFormulaUno.nombre = GanadoresFormulaUno;
      this.GanadoresFormulaUno.id = GanadoresFormulaUnoId;
    }
    this.Disputada = Disputada;

  }
}
