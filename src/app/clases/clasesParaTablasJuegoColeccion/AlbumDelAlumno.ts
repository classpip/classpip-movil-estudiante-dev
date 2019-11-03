export class AlbumDelAlumno {
  Nombre: string;
  Imagen: string;
  Probabilidad: string;
  Nivel: string;
  id: number;
  coleccionId: number;
  // tslint:disable-next-line:semicolon
  Tengi: boolean

  constructor(nombre?: string, imagen?: string, probabilidad?: string, nivel?: string, tengi?: boolean) {

    this.Nombre = nombre;
    this.Imagen = imagen;
    this.Probabilidad = probabilidad;
    this.Nivel = nivel;
    this.Tengi = tengi;
  }
}
