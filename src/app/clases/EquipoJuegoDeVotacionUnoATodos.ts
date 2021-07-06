export class EquipoJuegoDeVotacionUnoATodos {

  puntosTotales: number;
  id: number;
  equipoId: number;
  juegoDeVotacionUnoATodosId: number;
  Votos: any[];

  constructor(equipoId?: number, juegoDeVotacionUnoATodosId?: number) {

    this.equipoId = equipoId;
    this.juegoDeVotacionUnoATodosId = juegoDeVotacionUnoATodosId;
    this.puntosTotales = 0;
  }
}
