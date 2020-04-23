export class MiAlumnoAMostrarJuegoDeCuestionario {

    Nota: number;
    alumnoId: number;
    juegoDeCuestionarioId: number;
    id: number;
    Nombre: string;
    PrimerApellido: string;
    ImagenPerfil: string;
  
    constructor(alumnoId?: number, juegoDeCuestionarioId?: number, Nota?: number,
                Nombre?: string, PrimerApellido?: string, ImagenPerfil?: string) {
  
      this.alumnoId = alumnoId;
      this.juegoDeCuestionarioId = juegoDeCuestionarioId;
      this.Nota = Nota;
      this.Nombre = Nombre;
      this.PrimerApellido = PrimerApellido;
      this.ImagenPerfil = ImagenPerfil;
  
    }
  }