export class Cuestionario {
    Titulo: string;
    Descripcion: string;
    profesorId: number;
    id: number;

    constructor(titulo?: string, descripcion?: string){
        this.Titulo = titulo;
        this.Descripcion = descripcion;
    }
}