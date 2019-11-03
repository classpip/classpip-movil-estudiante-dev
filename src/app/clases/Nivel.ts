export class Nivel {

  Nombre: string;
  PuntosAlcanzar: number;
  PrivilegiosDelNivel: string;
  Imagen: string;
  id: number;
  juegoDePuntosId: number;

  constructor(Nombre?: string, PuntosAlcanzar?: number, PrivilegiosDelNivel?: string, Imagen?: string, juegoDePuntosId?: number) {

    this.Nombre = Nombre;
    this.PuntosAlcanzar = PuntosAlcanzar;
    this.PrivilegiosDelNivel = PrivilegiosDelNivel;
    this.Imagen = Imagen;
    this.juegoDePuntosId = juegoDePuntosId;

  }
}
