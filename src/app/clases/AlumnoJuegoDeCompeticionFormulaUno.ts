export class AlumnoJuegoDeCompeticionFormulaUno {

    PuntosTotalesAlumno: number;
    id: number;
    AlumnoId: number;
    JuegoDeCompeticionFormulaUnoId: number;
  
    constructor(AlumnoId?: number, JuegoDeCompeticionFormulaUnoId?: number, PuntosTotalesAlumno?: number, id?: number) {
  
      this.PuntosTotalesAlumno = PuntosTotalesAlumno;
      this.id = id;
      this.AlumnoId = AlumnoId;
      this.JuegoDeCompeticionFormulaUnoId = JuegoDeCompeticionFormulaUnoId;
  
    }
  }