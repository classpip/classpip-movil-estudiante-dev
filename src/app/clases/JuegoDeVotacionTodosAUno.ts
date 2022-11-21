export class JuegoDeVotacionTodosAUno {
  id: number;
  Tipo: string;
  grupoId: number;
  NombreJuego: string;
  Modo: string;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  Conceptos: string[];
  Pesos: number[];
  VotanEquipos: boolean; // en los juegos de equipo pueden votar equipos o alumnos


  constructor(Tipo?: string, Modo?: string, JuegoActivo?: boolean, Conceptos?: string[],
              Pesos?: number[], NombreJuego?: string,
              JuegoTerminado?: boolean, grupoId?: number, VotanEquipos?: boolean) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.Pesos = Pesos;
    this.Conceptos = Conceptos;
    this.NombreJuego = NombreJuego;
    this.JuegoTerminado = JuegoTerminado;
    this.grupoId = grupoId;
    this.VotanEquipos = VotanEquipos;
  }
}
