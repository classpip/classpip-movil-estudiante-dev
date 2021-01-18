import { Criterio } from './';
export class Rubrica {
    Nombre: string;
    Descripcion: string;
    id: number;
    profesorId: number;
    Criterios: Criterio[];

    constructor(nombre?: string, descripcion?: string, criterios?: Criterio[], profesorId?: number) {

        this.Nombre = nombre;
        this.Descripcion = descripcion;
        this.Criterios = criterios;
        this.profesorId = profesorId;
    }

}
