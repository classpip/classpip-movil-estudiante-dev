export class PuntoGeolocalizable {

    Nombre: string;
    Latitud: string;
    Longitud: string;
    PistaFacil: string;
    PistaDificil: string;
    id: number;
    idescenario: number;
    profesorId: number;

    constructor(nombre?: string, latitud?: string, longitud?: string, pistafacil?: string, pistadificil?: string){
        this.Nombre = nombre;
        this.Latitud = latitud;
        this.Longitud = longitud;
        this.PistaFacil = pistafacil;
        this.PistaDificil = pistadificil;
    }
}