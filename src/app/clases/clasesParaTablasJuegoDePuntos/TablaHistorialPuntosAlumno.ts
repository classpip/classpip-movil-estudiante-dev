export class TablaHistorialPuntosAlumno {


  nombre: string;
  descripcion: string;
  valorPunto: number;
  fecha: string;
  alumnoJuegoDePuntosId: number;
  historialId: number;
  puntoId: number;

  // tslint:disable-next-line:max-line-length
  constructor(nombre?: string, descripcion?: string, valorPunto?: number, fecha?: string, alumnoJuegoDePuntosId?: number, historialId?: number, puntoId?: number) {

    this.nombre = nombre;
    this.descripcion = descripcion;
    this.valorPunto = valorPunto;
    this.fecha = fecha;
    this.alumnoJuegoDePuntosId = alumnoJuegoDePuntosId;
    this.historialId = historialId;
    this.puntoId = puntoId;
  }
}
