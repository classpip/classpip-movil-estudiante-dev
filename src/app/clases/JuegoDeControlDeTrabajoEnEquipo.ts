
export class JuegoDeControlDeTrabajoEnEquipo {

    NombreJuego: string;
    Tipo: string;
    numeroDeControles: number;
    verRespuestasControl: boolean;
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    grupoId: number;
    profesorId: number;
    id: number;
  

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string,  numeroDeControles?: number,
                verRespuestasControl?: boolean, JuegoActivo?: boolean,
                JuegoTerminado?: boolean, grupoId?: number, profesorId?: number) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.numeroDeControles = numeroDeControles;
        this.verRespuestasControl = verRespuestasControl;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTerminado = JuegoTerminado;
        this.grupoId = grupoId;
        this.profesorId = profesorId;
    }
}
