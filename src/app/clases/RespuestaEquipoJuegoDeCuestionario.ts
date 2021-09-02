  export class RespuestaEquipoJuegoDeCuestionario {
    id: number;
    Respuesta: string[]; //puede ser un vector de string si la pregunta es de tipo "Emparejamiento" o un string en cualquier otro caso
    equipoJuegoDeCuestionarioId: number;
    preguntaId: number;
    constructor(equipoJuegoDeCuestionarioId?: number, preguntaId?: number, Respuesta?: string[]) {
  
      this.equipoJuegoDeCuestionarioId = equipoJuegoDeCuestionarioId;
      this.preguntaId = preguntaId;
      this.Respuesta = Respuesta;
    }
  }
  