import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Alumno, AlumnoJuegoDeCompeticionFormulaUno } from '../clases/index';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {
 
  constructor(private servidor: Socket) { }
  Conectar(alumno: Alumno) {
    this.servidor.connect();
    this.servidor.emit('usuarioConectado', alumno);
  }
  Desconectar(alumno: Alumno) {
    this.servidor.emit('usuarioDesconectado', alumno);
    this.servidor.disconnect();
  }
  Emitir(mensaje: string, info: any) {
    console.log ('voy a emitir ' + mensaje);
    console.log (info);
    console.log (this.servidor);
    this.servidor.emit(mensaje, info);
  }
  EnviarNick(nick: string) {
    this.servidor.connect();
    console.log ('envio nick: ' + nick);
    console.log (this.servidor);
    this.servidor.emit('nickNameJuegoRapido', nick);
  }

  EnviarNickYClave(nick: string, clave: string) {
    this.servidor.connect();
    console.log ('envio nick: ' + nick);
    console.log (this.servidor);
    this.servidor.emit('nickName+claveJuegoRapido', {
      n: nick,
      c: clave
    });
  }


  DesconectarJuegoRapido() {
    this.servidor.disconnect();
  }

  DesconectarJuegoCogerTurnoRapido(clave: string) {
    this.servidor.emit('desconectarJuegoCogerTurno', clave);
    this.servidor.disconnect();
  }


  public EsperarNotificaciones(): any {
    return Observable.create((observer) => {
        this.servidor.on('notificacion', (mensaje) => {
            console.log ('llega notificacion: ' + mensaje);
            observer.next(mensaje);
        });
    });
  }

  public EsperoTurnosCogidos(): any  {
    return Observable.create((observer) => {
        this.servidor.on('turnoCogido', (turno) => {
            console.log ('han cogido un turno');
            console.log (turno);
            observer.next(turno);
        });
    });
  }

  public EsperoTurnosNuevos(): any  {
    return Observable.create((observer) => {
        this.servidor.on('turnoNuevo', (turno) => {
            observer.next(turno);
        });
    });
  }
  public RecordarContrasena(alumno: Alumno) {
    console.log ('dentro del servicio para recordar contraseña');
    // Me conecto momentaneamente para enviarle al alumno la contraseña que debe enviar por email
    this.servidor.connect();
    this.servidor.emit ('recordarContraseña' , {email: alumno.Email, nombre: alumno.Username, contrasena: alumno.Password});
    // Me desconecto
    this.servidor.disconnect();
  }
}


