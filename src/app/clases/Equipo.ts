export class Equipo {
  Nombre: string;
  FotoEquipo: string;
  id: number;
  grupoId: number;

  constructor(nombre?: string, FotoEquipo?: string) {

    this.Nombre = nombre;
    this.FotoEquipo = FotoEquipo;
  }
}
