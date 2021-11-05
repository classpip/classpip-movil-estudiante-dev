export class EquipoJuegoDeCompeticionTorneo {

    
  EquipoId: number;
  JuegoDeCompeticionTorneoId: number;
  id: number;
  nombre:string;
  
  
  constructor(EquipoId?: number,JuegoDeCompeticionTorneoId?: number, id?: number,nombre?:string ) {
  
    this.EquipoId = EquipoId;
    this.JuegoDeCompeticionTorneoId = JuegoDeCompeticionTorneoId;
    this.id = id;
    this.nombre = nombre;
    
  }
}
  