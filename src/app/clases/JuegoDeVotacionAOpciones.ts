export class JuegoDeVotacionAOpciones {
  id: number;
  Tipo: string;
  grupoId: number;
  NombreJuego: string;
  Modo: string;
  ModoReparto: string;
  JuegoActivo: boolean;
  JuegoTerminado: boolean;
  Opciones: string[];
  Puntos: number[];



  constructor(Tipo?: string, Modo?: string, JuegoActivo?: boolean, Opciones?: string[],
              Puntos?: number[], NombreJuego?: string, ModoReparto?: string,
              JuegoTerminado?: boolean, grupoId?: number) {

    this.Tipo = Tipo;
    this.Modo = Modo;
    this.ModoReparto = ModoReparto;
    this.JuegoActivo = JuegoActivo;
    this.Opciones = Opciones;
    this.Puntos = Puntos;
    this.NombreJuego = NombreJuego;
    this.JuegoTerminado = JuegoTerminado;
    this.grupoId = grupoId;
  }
}
