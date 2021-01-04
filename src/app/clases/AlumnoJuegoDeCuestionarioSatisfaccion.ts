export class AlumnoJuegoDeCuestionarioSatisfaccion {



  Contestado: boolean;
  RespuestasAfirmaciones: number [];
  RespuestasPreguntasAbiertas: string[];
  id: number;
  alumnoId: number;
  juegoDeCuestionarioSatisfaccionId: number;


  constructor(Contestado?: boolean, juegoDeCuestionarioId?: number, alumnoId?: number) {
      this.Contestado = Contestado;
      this.alumnoId = alumnoId;
      this.juegoDeCuestionarioSatisfaccionId = juegoDeCuestionarioId;
  }
}




