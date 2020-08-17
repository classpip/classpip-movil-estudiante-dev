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


  constructor(Tipo?: string, Modo?: string, JuegoActivo?: boolean, Conceptos?: string[],
              Pesos?: number[], NombreJuego?: string,
              JuegoTerminado?: boolean, grupoId?: number) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.JuegoActivo = JuegoActivo;
    this.Pesos = Pesos;
    this.Conceptos = Conceptos;
    this.NombreJuego = NombreJuego;
    this.JuegoTerminado = JuegoTerminado;
    this.grupoId = grupoId;
  }
}
