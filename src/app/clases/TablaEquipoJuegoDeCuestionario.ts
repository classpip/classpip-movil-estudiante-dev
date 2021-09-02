export class TablaEquipoJuegoDeCuestionario {

    nombre: string;
    nota: number;
    contestado: boolean;
    tiempoEmpleado: number;
    id: number;

    constructor(nombre?: string,
                nota?: number, contestado?: boolean, id?: number, tiempoEmpleado?: number) {

      this.nombre = nombre;
      this.nota = nota;
      this.contestado = contestado;
      this.id = id;
      this.tiempoEmpleado = tiempoEmpleado;
    }
  }
