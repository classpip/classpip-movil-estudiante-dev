import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {
 
  constructor(private servidor: Socket) { }
  Conectar() {
    this.servidor.connect();
  }
  Emitir(mensaje: string, info: any) {
    this.servidor.emit(mensaje, info);
  }
}


