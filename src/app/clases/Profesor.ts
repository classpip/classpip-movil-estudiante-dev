export class Profesor {
  Nombre: string;
  Apellido: string;
  ImagenPerfil: string;
  id: number;

  constructor(nombre?: string, apellido?: string, imagenPerfil?: string, id?: number) {

    this.Nombre = nombre;
    this.Apellido = apellido;
    this.ImagenPerfil = imagenPerfil;
    this.id = id;
  }
}
