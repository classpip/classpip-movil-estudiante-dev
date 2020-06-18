export class AlumnoJuegoDeCuestionario {

    Nota: number;
    Contestado: boolean;
    id: number;
    alumnoId: number;
    juegoDeCuestionarioId: number;

    constructor(Nota?: number, Contestado?: boolean, juegoDeCuestionarioId?: number, alumnoId?: number) {
        this.Nota = Nota;
        this.Contestado = Contestado;
        this.alumnoId = alumnoId;
        this.juegoDeCuestionarioId = juegoDeCuestionarioId;
    }
}
