export class JuegoDeEvaluacion {

    id: number;
    NombreJuego: string;
    Tipo: string;
    Modo: string;
    JuegoActivo: boolean;
    JuegoTerminado: boolean;
    profesorEvalua: boolean;
    notaProfesorNormal: boolean;
    autoEvaluacion: boolean;
    Evaluadores: number;
    Pesos: any[];
    metodoSubcriterios: boolean;
    Penalizacion: any[];
    rubricaId: number;
    profesorId: number;
    grupoId: number;


    // tslint:disable-next-line:max-line-length
    constructor(id: number, NombreJuego: string, Tipo: string, Modo: string, JuegoActivo: boolean, JuegoTerminado: boolean, profesorEvalua: boolean, notaProfesorNormal: boolean, autoEvaluacion: boolean, Evaluadores: number, Pesos: any[], metodoSubcriterios: boolean, Penalizacion: any[], rubricaId: number, profesorId: number, grupoId: number) {
        this.id = id;
        this.NombreJuego = NombreJuego;
        this.Tipo = Tipo;
        this.Modo = Modo;
        this.JuegoActivo = JuegoActivo;
        this.JuegoTerminado = JuegoTerminado;
        this.profesorEvalua = profesorEvalua;
        this.notaProfesorNormal = notaProfesorNormal;
        this.autoEvaluacion = autoEvaluacion;
        this.Evaluadores = Evaluadores;
        this.Pesos = Pesos;
        this.metodoSubcriterios = metodoSubcriterios;
        this.Penalizacion = Penalizacion;
        this.rubricaId = rubricaId;
        this.profesorId = profesorId;
        this.grupoId = grupoId;
    }
}
