export class Escenario {

    Mapa: string;
    Descripcion: string;
    profesorId: number;
    id: number;

    constructor(mapa?: string, descripcion?: string){
        this.Mapa = mapa;
        this.Descripcion = descripcion;
    }
}