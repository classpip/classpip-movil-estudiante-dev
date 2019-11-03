export class Insignia {
  Nombre: string;
  Descripcion: string;
  Imagen: string;
  id: number;
  profesorId: number;


  constructor(nombre?: string, descripcion?: string, imagen?: string) {

    this.Nombre = nombre;
    this.Descripcion = descripcion;
    this.Imagen = imagen;
  }

}
