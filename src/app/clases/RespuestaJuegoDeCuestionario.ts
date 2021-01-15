  export class RespuestaJuegoDeCuestionario {
    id: number;
    Respuesta: string[]; //puede ser un vector de string si la pregunta es de tipo "Emparejamiento" o un string en cualquier otro caso
    alumnoJuegoDeCuestionarioId: number;
    preguntaId: number;
    constructor(alumnoJuegoDeCuestionarioId?: number, preguntaId?: number, Respuesta?: string[]) {
  
      this.alumnoJuegoDeCuestionarioId = alumnoJuegoDeCuestionarioId;
      this.preguntaId = preguntaId;
      this.Respuesta = Respuesta;
    }
  }
  