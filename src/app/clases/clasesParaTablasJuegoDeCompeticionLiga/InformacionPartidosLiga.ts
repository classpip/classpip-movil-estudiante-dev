export class InformacionPartidosLiga {
  participanteId: number;
  partidosTotales: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;

  constructor(participanteId?: number, partidosTotales?: number, partidosJugados?: number,
              partidosGanados?: number, partidosEmpatados?: number, partidosPerdidos?: number) {

    this.participanteId = participanteId;
    this.partidosTotales = partidosTotales;
    this.partidosJugados = partidosJugados;
    this.partidosGanados = partidosGanados;
    this.partidosEmpatados = partidosEmpatados;
    this.partidosPerdidos = partidosPerdidos;
  }
}
