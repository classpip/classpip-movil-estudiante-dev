export class Alumno {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  ImagenPerfil: string;
  Username: string;
  Password: string;
  Email: string;
  PermisoCambioImagenPerfil: boolean;
  profesorId: number;
  id: number;

  constructor(nombre?: string, primerApellido?: string, segundoApellido?: string,
              Username?: string, Password?: string, Email?: string, profesorId?: number,
              imagenPerfil?: string) {

    this.Nombre = nombre;
    this.PrimerApellido = primerApellido;
    this.SegundoApellido = segundoApellido;
    this.ImagenPerfil = null;
    this.PermisoCambioImagenPerfil = false;
    this.Username = Username;
    this.Password = Password;
    this.Email = Email;
    this.profesorId = profesorId;
  }
}
