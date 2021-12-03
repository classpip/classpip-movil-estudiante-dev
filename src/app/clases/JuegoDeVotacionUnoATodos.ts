export class JuegoDeVotacionUnoATodos {
  id: number;
  Tipo: string;
  grupoId: number;
  NombreJuego: string;
  Modo: string;
  ModoReparto: string;
  PermitirAutovotacion: boolean;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  Puntos: number[];
  VotanEquipos: boolean; // en los juegos de equipo pueden votar equipos o alumnos


  constructor(Tipo?: string, Modo?: string, ModoReparto?: string,  PermitirAutovotacion?: boolean, JuegoActivo?: boolean,
              Puntos?: number[], NombreJuego?: string,
              JuegoTerminado?: boolean, grupoId?: number, VotanEquipos?: boolean) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.ModoReparto = ModoReparto;
    this.PermitirAutovotacion = PermitirAutovotacion;
    this.JuegoActivo = JuegoActivo;
    this.Puntos = Puntos;
    this.NombreJuego = NombreJuego;
    this.JuegoTerminado = JuegoTerminado;
    this.grupoId = grupoId;
    this.VotanEquipos = VotanEquipos;
  }
}
