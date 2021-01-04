export class JuegoDeCuestionarioSatisfaccion {

    NombreJuego: string;
    Tipo: string;
    Presentacion: string;
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    id: number;
    profesorId: number;
    grupoId: number;
    cuestionarioSatisfaccionId: number;

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, Presentacion?: string, JuegoActivo?: boolean, JuegoTerminado?: boolean,
                profesorId?: number, grupoId?: number, cuestionarioSatisfaccionId?: number) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.Presentacion = Presentacion;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTerminado = JuegoTerminado;
        this.profesorId = profesorId;
        this.grupoId = grupoId;
        this.cuestionarioSatisfaccionId = cuestionarioSatisfaccionId;
    }
}
