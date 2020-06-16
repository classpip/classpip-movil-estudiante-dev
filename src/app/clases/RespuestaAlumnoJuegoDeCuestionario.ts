export class RespuestaAlumnoJuegoDeCuestionario {
    
    preguntaId: number;
    alumnoJuegoDeCuestionarioId: number;
    id: number;
    Respuesta: string;
  
    constructor(preguntaId?: number, alumnoJuegoDeCuestionarioId?: number, Respuesta?: string) {
  
      this.preguntaId = preguntaId;
      this.alumnoJuegoDeCuestionarioId = alumnoJuegoDeCuestionarioId;
      this.Respuesta = Respuesta;
  
    }
  }
  