export class EquipoJuegoDeCuestionario {

  Nota: number;
  TiempoEmpleado: number;
  Contestado: boolean;
  id: number;
  equipoId: number;
  juegoDeCuestionarioId: number;


  constructor(Nota?: number, Contestado?: boolean, juegoDeCuestionarioId?: number, equipoId?: number, TiempoEmpleado?: number) {
      this.Nota = Nota;
      this.Contestado = Contestado;
      this.equipoId = equipoId;
      this.juegoDeCuestionarioId = juegoDeCuestionarioId;
      this.TiempoEmpleado = TiempoEmpleado;
  }
}
