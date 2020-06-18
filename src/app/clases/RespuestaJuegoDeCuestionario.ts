  export class RespuestaJuegoDeCuestionario {
    id: number;
    Respuesta: string;
    alumnoJuegoDeCuestionarioId: number;
    preguntaId: number;
    constructor(alumnoJuegoDeCuestionarioId?: number, preguntaId?: number, Respuesta?: string) {
  
      this.alumnoJuegoDeCuestionarioId = alumnoJuegoDeCuestionarioId;
      this.preguntaId = preguntaId;
      this.Respuesta = Respuesta;
    }
  }