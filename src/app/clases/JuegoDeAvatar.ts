export class JuegoDeAvatar {
    NombreJuego: string;
    Tipo: string;
    Modo: string;
    JuegoActivo: boolean;
    Familias: number[];
    CriteriosPrivilegioComplemento1: string;
    CriteriosPrivilegioComplemento2: string;
    CriteriosPrivilegioComplemento3: string;
    CriteriosPrivilegioComplemento4: string;
    CriteriosPrivilegioVoz: string;
    CriteriosPrivilegioVerTodos: string;
    id: number;
    grupoId: number;
  
    constructor( NombreJuego?: string, Tipo?: string, Modo?: string, JuegoActivo?: boolean) {
  
      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.NombreJuego = NombreJuego;
    }
  }