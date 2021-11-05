export class AlumnoJuegoDeCompeticionTorneo{

  AlumnoId: number;
  id: number;
  JuegoDeCompeticionTorneoId: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
   
  
  constructor(AlumnoId?: number, JuegoDeCompeticionTorneoId?: number, id?: number,nombre?: string,primerApellido?: string,segundoApellido?: string) {
  
     
    this.id = id;
    this.AlumnoId = AlumnoId;
    this.JuegoDeCompeticionTorneoId = JuegoDeCompeticionTorneoId;
    this.nombre = nombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
  
  }
}
  