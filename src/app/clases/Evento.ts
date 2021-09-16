export class Evento {
    TipoEvento: number; //Required
    FechayHora: Date; //Required
    ProfesorID: number; //Required
    AlumnoID: number;
    EquipoID: number;
    JuegoID: number;
    NombreJuego: string;
    TipoJuego: string; //Es necesario, entre otras cosas, porque el rango de IDs de Juego es unívoco sólamente para un Tipo de Juego en concreto, no para todos
    PuntoID: number; //Tipo de Punto obtenido
    NumeroPuntos: number;
    NivelID: number; //Nivel obtenido en un Juego de Puntos
    NumeroCromos: number;
    AlumnoReceptorCromoID: number; //ID del Alumno al cual se le ha regalado un cromo (en este caso, AlumnoID será el ID del Alumno que regala el cromo)
    EquipoReceptorCromoID: number; //ID del Equipo al cual se le ha regalado un cromo (en este caso, EquipoID será el ID del Equipo que regala el cromo)
    Privilegio: number; //Privilegio asignado/eliminado en un Juego de Avatar

    constructor(tipoEvento: number, fechayhora: Date, profesorID: number, alumnoID?: number, equipoID?: number, juegoID?: number,  nombreJuego?: string, tipoJuego?: string, puntoID?: number, numeroPuntos?: number, nivelID?: number, numeroCromos?: number, alumnoReceptorCromoID?: number, equipoReceptorCromoID?: number, privilegio?: number){
        this.TipoEvento = tipoEvento;
        this.FechayHora = fechayhora;
        this.ProfesorID = profesorID;
        this.AlumnoID = alumnoID;
        this.EquipoID = equipoID;
        this.JuegoID = juegoID;
        this.NombreJuego = nombreJuego;
        this.TipoJuego = tipoJuego;
        this.PuntoID = puntoID;
        this.NumeroPuntos = numeroPuntos;
        this.NivelID = nivelID;
        this.NumeroCromos = numeroCromos;
        this.AlumnoReceptorCromoID = alumnoReceptorCromoID;
        this.EquipoReceptorCromoID = equipoReceptorCromoID;
        this.Privilegio = privilegio;
    }

    //Para crear un nuevo Evento (sólo son obligatorios los 3 primeros parámetros):
    //new Evento(tipoEvento, new Date(), profesorID, alumnoID, equipoID, juegoID, nombreJuego, tipoJuego, puntoID, numeroPuntos, nivelID, numeroCromos, alumnoReceptorCromoID, equipoReceptorCromoID, privilegio);
    //tipoEvento: 1 (Creación de Juego) | 2 (Acceso al Juego) | 10 (Asignación de Punto/s) | 11 (Ascenso de Nivel) | 20 (Asignación de Cromo/s) | 21 (Regalo de Cromo) | 22 (Finalización de Colección de Cromos) | 30 (Asignación de Privilegio) | 31 (Eliminación de Privilegio) | 32 (Modificación de Avatar)

    //Para Parsear el Date del Evento que viene de la API (en JSON no existe la variable Date por lo que se recibe como string y no como Date, entonces hay que parsearla):
    //new Date(res.evento[i].FechayHora);
}