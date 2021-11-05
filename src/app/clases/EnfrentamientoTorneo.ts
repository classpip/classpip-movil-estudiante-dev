export class EnfrentamientoTorneo {
  JugadorUno: number;
  JugadorDos: number;
  Ganador: number;
  JornadaDeCompeticionTorneoId: number;
  nombreJugadorUno: string;
  nombreJugadorDos: string;
  nombreGanador: string;
  id: number;
  perdedor: string;

  constructor(JugadorUno?: number, JugadorDos?: number, Ganador?: number, JornadaDeCompeticionTorneoId?: number,nombreJugadorUno?: string, nombreJugadorDos?: string, id?: number, perdedor?: string) {

    this.JugadorUno = JugadorUno;
    this.JugadorDos = JugadorDos;
    this.Ganador = Ganador;
    this.JornadaDeCompeticionTorneoId = JornadaDeCompeticionTorneoId;
    if (nombreJugadorUno !== undefined && nombreJugadorDos !== undefined) {
      this.nombreJugadorUno = nombreJugadorUno;
      this.nombreJugadorDos = nombreJugadorDos;
    }
    this.id = id;
    this.perdedor = perdedor;
   
  }
}
