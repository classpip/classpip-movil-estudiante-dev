export class Coleccion {
  Nombre: string;
  ImagenColeccion: string;
  DosCaras: boolean;
  id: number;
  profesorId: number;

  constructor(nombre?: string, imagenColeccion?: string, dosCaras?: boolean) {

    this.Nombre = nombre;
    this.ImagenColeccion = imagenColeccion;
    this.DosCaras = dosCaras;
  }
}
