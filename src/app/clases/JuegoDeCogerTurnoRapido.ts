export class JuegoDeCogerTurnoRapido {

    NombreJuego: string;
    Tipo: string;
    Presentacion: string;
    Clave: string;
    id: number;
    profesorId: number;
    Turnos: any[];


    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, Clave?: string,
                profesorId?: number,  Presentacion?: string, Turnos?: any[]) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.profesorId = profesorId;
        this.Clave = Clave;
        this.Presentacion = Presentacion;
        this.Turnos = Turnos;
    }
}
