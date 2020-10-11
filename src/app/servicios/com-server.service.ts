import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Alumno } from '../clases/index';
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
  DesconectarJuegoRapido() {
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
}


