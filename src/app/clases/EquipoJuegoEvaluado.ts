export class EquipoJuegoEvaluado {

    id: number;
    juegoEvaluacionId: number;
    equipoId: number;
    equiposEvaluadoresIds: number[];
    alumnosEvaluadoresIds: number[];
    notaFinal: number;

    // tslint:disable-next-line:max-line-length
    constructor(id: number, juegoEvaluacionId: number, equipoEvaluadoId: number, equiposEvaluadoresIds: number[], alumnosEvaluadoresIds: number[], notaFinal: number) {
        this.id = id;
        this.juegoEvaluacionId = juegoEvaluacionId;
        this.equipoId = equipoEvaluadoId;
        this.equiposEvaluadoresIds = equiposEvaluadoresIds;
        this.alumnosEvaluadoresIds = alumnosEvaluadoresIds;
        this.notaFinal = notaFinal;
    }
}
