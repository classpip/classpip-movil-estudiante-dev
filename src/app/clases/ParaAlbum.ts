export class ParaAlbum {
  Nombre: string;
  ImagenDelante: string;
  ImagenDetras: string;
  Probabilidad: string;
  Nivel: string;
  id: number;
  coleccionId: number;
  // tslint:disable-next-line:semicolon
  Tengi: boolean

  constructor(nombre?: string, probabilidad?: string, nivel?: string, tengi?: boolean,  imagenDelante?: string,  imagenDetras?: string) {

    this.Nombre = nombre;
    this.ImagenDelante = imagenDelante;
    this.ImagenDetras = imagenDetras;
    this.Probabilidad = probabilidad;
    this.Nivel = nivel;
    this.Tengi = tengi;
  }
}
