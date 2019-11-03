export class Cromo {
  Nombre: string;
  Imagen: string;
  Probabilidad: string;
  Nivel: string;
  id: number;
  coleccionId: number;

  constructor(nombre?: string, imagen?: string, probabilidad?: string, nivel?: string) {

    this.Nombre = nombre;
    this.Imagen = imagen;
    this.Probabilidad = probabilidad;
    this.Nivel = nivel;
  }
}
