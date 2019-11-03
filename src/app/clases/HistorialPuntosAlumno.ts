export class HistorialPuntosAlumno {

  ValorPunto: number;
  puntoId: number;
  alumnoJuegoDePuntosId: number;
  id: number;
  fecha: string;

  constructor(ValorPunto?: number, puntoId?: number, alumnoJuegoDePuntosId?: number, fecha?: string) {

    this.ValorPunto = ValorPunto;
    this.puntoId = puntoId;
    this.alumnoJuegoDePuntosId = alumnoJuegoDePuntosId;
    this.fecha = fecha;

  }
}
