export class TablaClasificacionJornada {

  participante: string;
  puntos: number;
  posicion: number;
  id: number;

  constructor(participante?: string, puntos?: number, posicion?: number, id?: number) {
    this.participante = participante;
    this.puntos = puntos;
    this.posicion = posicion;
    this.id = id;
  }
}
