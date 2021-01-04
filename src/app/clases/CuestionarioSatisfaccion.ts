export class CuestionarioSatisfaccion {
    Titulo: string;
    Descripcion: string;
    Afirmaciones: string[];
    PreguntasAbiertas: string[];
    profesorId: number;
    id: number;

    constructor(Titulo?: string, Descripcion?: string, Afirmaciones?: string[], PreguntasAbiertas?: string[], profesorId?: number) {
        this.Titulo = Titulo;
        this.Descripcion = Descripcion;
        this.Afirmaciones = Afirmaciones;
        this.PreguntasAbiertas = PreguntasAbiertas;
        this.profesorId = profesorId;
    }
}

