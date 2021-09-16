export class EquipoJuegoDeEvaluacion {
    id: number;
    juegoDeEvaluacionId: number;
    equipoId: number;
    equiposEvaluadoresIds: number[];
    alumnosEvaluadoresIds: number[];
    respuestas: any[];
    notaFinal: number;

    // tslint:disable-next-line:max-line-length
    constructor(id: number, juegoDeEvaluacionId: number, equipoId: number, equiposEvaluadoresIds: number[], alumnosEvaluadoresIds: number[], respuestas: any[], notaFinal: number) {
        this.id = id;
        this.juegoDeEvaluacionId = juegoDeEvaluacionId;
        this.equipoId = equipoId;
        this.equiposEvaluadoresIds = equiposEvaluadoresIds;
        this.alumnosEvaluadoresIds = alumnosEvaluadoresIds;
        this.respuestas = respuestas;
        this.notaFinal = notaFinal;
    }
}
