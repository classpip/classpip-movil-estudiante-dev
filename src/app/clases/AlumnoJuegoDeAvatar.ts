export class AlumnoJuegoDeAvatar {
    Silueta: string;
    Privilegios: boolean[];
    Complemento1: string;
    Complemento2: string;
    Complemento3: string;
    Complemento4: string;
    Voz: string;
    id: number;
    alumnoId: number;
    juegoDeAvatarId: number;
  
    constructor(alumnoId?: number, juegoDeAvatarId?: number) {
      this.alumnoId = alumnoId;
      this.juegoDeAvatarId = juegoDeAvatarId;
      this.Privilegios = Array(6).fill (false);
    }
  }
  