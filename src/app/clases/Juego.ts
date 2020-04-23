export class Juego {
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  grupoId: number;
  id: number;
  NombreJuego: string;
  PuntuacionCorrecta: number;
  PuntuacionIncorrecta: number;
  Presentacion: string;
  JuegoTerminado: boolean;
  profesorId: number;
  cuestionarioId: number;

  coleccionId: number;

  TipoDeCompeticion: string;

  constructor(Tipo?: string, Modo?: string, coleccionId?: number, JuegoActivo?: boolean, TipoDeCompeticion?: string,
    NombreJuego?: string, PuntuacionCorrecta?: number, PuntuacionIncorrecta?: number, 
    Presentacion?: string, JuegoTermiando?: boolean, profesorId?: number, cuestionarioId?: number) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.coleccionId = coleccionId;
    this.TipoDeCompeticion = TipoDeCompeticion;
    this.NombreJuego = NombreJuego;
    this.PuntuacionCorrecta = PuntuacionCorrecta;
    this.PuntuacionIncorrecta = PuntuacionIncorrecta;
    this.Presentacion = Presentacion;
    this.JuegoTerminado = JuegoTermiando;
    this.profesorId = profesorId;
    this.cuestionarioId = cuestionarioId;
  }
}
