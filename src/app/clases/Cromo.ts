export class Cromo {
  Nombre: string;
  ImagenDelante: string;
  ImagenDetras: string;
  Probabilidad: string;
  Nivel: string;
  id: number;
  coleccionId: number;

  constructor(nombre?: string, probabilidad?: string, nivel?: string, imagenDelante?: string, imagenDetras?: string) {

    this.Nombre = nombre;
    this.Probabilidad = probabilidad;
    this.Nivel = nivel;
    this.ImagenDelante = imagenDelante;
    this.ImagenDetras = imagenDetras;
  }
}
