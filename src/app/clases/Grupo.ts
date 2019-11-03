export class Grupo {
  Nombre: string;
  Descripcion: string;
  id: number;
  profesorId: number;

  constructor(nombre?: string, Descripcion?: string) {

    this.Nombre = nombre;
    this.Descripcion = Descripcion;
  }

}
