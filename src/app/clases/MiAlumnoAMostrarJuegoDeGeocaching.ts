export class MiAlumnoAMostrarJuegoDeGeocaching {

    Puntuacion: number;
    Etapa: number;
    alumnoId: number;
    juegoDeGeocachingId: number;
    id: number;
    Nombre: string;
    PrimerApellido: string;
    ImagenPerfil: string;
  
    constructor(alumnoId?: number, juegoDeGeocachingId?: number, Puntuacion?: number, Etapa?: number,
                Nombre?: string, PrimerApellido?: string, ImagenPerfil?: string) {
  
      this.alumnoId = alumnoId;
      this.juegoDeGeocachingId = juegoDeGeocachingId;
      this.Puntuacion = Puntuacion;
      this.Etapa = Etapa;
      this.Nombre = Nombre;
      this.PrimerApellido = PrimerApellido;
      this.ImagenPerfil = ImagenPerfil;
  
    }
  }