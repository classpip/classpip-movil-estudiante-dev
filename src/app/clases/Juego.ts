export class Juego {
  Tipo: string;
  Modo: string;
  JuegoActivo: boolean;
  grupoId: number;
  id: number;
  NumeroTotalJornadas: number;
  coleccionId: number;
  TipoJuegoCompeticion: string;
  NumeroParticipantesPuntuan: number;
  Puntos: number[];
  NombreJuego: string;

  constructor(Tipo?: string, Modo?: string, coleccionId?: number, JuegoActivo?: boolean,
    NumeroTotalJornadas?: number, TipoJuegoCompeticion?: string, NumeroParticipantesPuntuan?: number,
    Puntos?: number[], NombreJuego?: string) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.coleccionId = coleccionId;
    this.NumeroTotalJornadas = NumeroTotalJornadas;
    this.TipoJuegoCompeticion = TipoJuegoCompeticion;
    this.NumeroParticipantesPuntuan = NumeroParticipantesPuntuan;
    this.Puntos = Puntos;
    this.NombreJuego = NombreJuego;
    
  }
}
