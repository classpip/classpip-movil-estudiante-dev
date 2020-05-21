export class AlumnoJuegoDeCuestionario {
    
  alumnoId: number;
  juegoDeCuestionarioId: number;
  id: number;
  Nota: number;

  constructor(alumnoId?: number, juegoDeCuestionarioId?: number, Nota?: number) {

    this.alumnoId = alumnoId;
    this.juegoDeCuestionarioId = juegoDeCuestionarioId;
    this.Nota = Nota;

  }
}
