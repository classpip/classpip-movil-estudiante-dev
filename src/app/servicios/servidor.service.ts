import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {
  private servidor: Socket;
  constructor() { }
  Conectar() {
    this.servidor.connect();
  }
  Emitir(mensaje: string, info: any) {
    this.servidor.emit(mensaje, info);
  }
}
