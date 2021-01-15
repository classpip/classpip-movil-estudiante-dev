export class AlumnoJuegoEvaluado {
    id: number;
    juegoEvaluacionId: number;
    alumnoEvaluadoId: number;
    alumnosEvaluadoresIds: number[];
    notaFinal: number;

    constructor(id: number, juegoEvaluacionId: number, alumnoEvaluadoId: number, alumnosEvaluadoresIds: number[], notaFinal: number) {
        this.id = id;
        this.juegoEvaluacionId = juegoEvaluacionId;
        this.alumnoEvaluadoId = alumnoEvaluadoId;
        this.alumnosEvaluadoresIds = alumnosEvaluadoresIds;
        this.notaFinal = notaFinal;
    }
}
