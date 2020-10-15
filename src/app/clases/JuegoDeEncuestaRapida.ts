export class JuegoDeEncuestaRapida {

    NombreJuego: string;
    Tipo: string;
    Clave: string;
    id: number;
    profesorId: number;
    cuestionarioSatisfaccionId: number;

    // tslint:disable-next-line:max-line-length
    constructor(NombreJuego?: string, Tipo?: string, Clave?: string,
                profesorId?: number, cuestionarioSatisfaccionId?: number) {
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.profesorId = profesorId;
        this.Clave = Clave;
        this.cuestionarioSatisfaccionId = cuestionarioSatisfaccionId;
    }
}
