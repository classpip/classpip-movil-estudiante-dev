export class JuegoDeVotacionUnoATodos {
    id: number;
    Tipo: string;
    grupoId: number;
    NombreJuego: string;
    Modo: string;
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    Puntos: number[];
  
  
    constructor(Tipo?: string, Modo?: string, JuegoActivo?: boolean,
                Puntos?: number[], NombreJuego?: string,
                JuegoTerminado?: boolean, grupoId?: number) {
  
      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.Puntos = Puntos;
      this.NombreJuego = NombreJuego;
      this.JuegoTerminado = JuegoTerminado;
      this.grupoId = grupoId;
    }
  }
  