export class EquipoJuegoDeVotacionTodosAUno {

  PuntosTotales: number;
  id: number;
  equipoId: number;
  juegoDeVotacionTodosAUnoId: number;
  VotosEmitidos: any[];
  VotosRecibidos: any[];
  VotosEmitidosMiembro: any[];

  constructor(equipoId?: number, juegoDeVotacionTodosAUnoId?: number) {

    this.equipoId = equipoId;
    this.juegoDeVotacionTodosAUnoId = juegoDeVotacionTodosAUnoId;
    this.PuntosTotales = 0;
    this.VotosEmitidos = [];
    this.VotosRecibidos = [];
    this.VotosEmitidosMiembro =[];
  }
  
}
