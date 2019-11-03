export class Matricula {
  alumnoId: number;
  grupoId: number;
  id: number;

  constructor(alumnoId?: number, grupoId?: number) {

    this.alumnoId = alumnoId;
    this.grupoId = grupoId;
  }
}
