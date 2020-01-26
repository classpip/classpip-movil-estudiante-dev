export class MiAlumnoAMostrarJuegoDePuntos {

  PuntosTotalesAlumno: number;
  alumnoId: number;
  juegoDePuntosId: number;
  id: number;
  nivelId: number;
  Nombre: string;
  PrimerApellido: string;
  ImagenPerfil: string;

  constructor(alumnoId?: number, juegoDePuntosId?: number, PuntosTotalesAlumno?: number,
              nivelId?: number, Nombre?: string, PrimerApellido?: string, ImagenPerfil?: string) {

    this.alumnoId = alumnoId;
    this.juegoDePuntosId = juegoDePuntosId;
    this.nivelId = nivelId;
    this.PuntosTotalesAlumno = PuntosTotalesAlumno;
    this.Nombre = Nombre;
    this.PrimerApellido = PrimerApellido;
    this.ImagenPerfil = ImagenPerfil;

  }
}

