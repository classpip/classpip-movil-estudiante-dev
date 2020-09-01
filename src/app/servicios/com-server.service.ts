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
    this.servidor.emit(mensaje, info);
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


