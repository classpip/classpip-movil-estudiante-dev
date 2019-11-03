export class Alumno {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  ImagenPerfil: string;
  profesorId: string;
  id: number;

  constructor(nombre?: string, primerApellido?: string, segundoApellido?: string, imagenPerfil?: string) {

    this.Nombre = nombre;
    this.PrimerApellido = primerApellido;
    this.SegundoApellido = segundoApellido;
    this.ImagenPerfil = imagenPerfil;
  }
}
