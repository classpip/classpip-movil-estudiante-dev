import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {
 
  constructor(private servidor: Socket) { }
  Conectar(nombre: string) {
    this.servidor.connect();
    this.servidor.emit('usuarioConectado', nombre);
  }
  Desconectar(nombre: string) {
    this.servidor.emit('usuarioDesconectado', nombre);
    this.servidor.disconnect();
  }
  Emitir(mensaje: string, info: any) {
    this.servidor.emit(mensaje, info);
  }
}


