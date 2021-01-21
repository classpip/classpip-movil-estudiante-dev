export class AlumnoJuegoDeEvaluacion {
    id: number;
    juegoDeEvaluacionId: number;
    alumnoId: number;
    alumnosEvaluadoresIds: number[];
    respuestas: any[];
    notaFinal: number;

    // tslint:disable-next-line:max-line-length
    constructor(id: number, juegoDeEvaluacionId: number, alumnoId: number, alumnosEvaluadoresIds: number[], respuestas: any[], notaFinal: number) {
        this.id = id;
        this.juegoDeEvaluacionId = juegoDeEvaluacionId;
        this.alumnoId = alumnoId;
        this.alumnosEvaluadoresIds = alumnosEvaluadoresIds;
        this.respuestas = respuestas;
        this.notaFinal = notaFinal;
    }
}
