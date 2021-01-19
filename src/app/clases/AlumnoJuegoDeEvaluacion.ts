export class AlumnoJuegoDeEvaluacion {
    id: number;
    juegoDeEvaluacionId: number;
    alumnoId: number;
    alumnosEvaluadoresIds: number[];
    notaFinal: number;

    constructor(id: number, juegoDeEvaluacionId: number, alumnoId: number, alumnosEvaluadoresIds: number[], notaFinal: number) {
        this.id = id;
        this.juegoDeEvaluacionId = juegoDeEvaluacionId;
        this.alumnoId = alumnoId;
        this.alumnosEvaluadoresIds = alumnosEvaluadoresIds;
        this.notaFinal = notaFinal;
    }
}
