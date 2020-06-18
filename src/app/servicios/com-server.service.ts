import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {
  // private url = 'http://localhost:8080';
  private url = 'http://147.83.118.92:8080';
  private socket;


  constructor() { }

  // public Conectar(alumnoId: number) {
  //   this.socket = io(this.url);
  //   this.socket.emit ('alumno', alumnoId);
  // }

  // public NotificarRespuestaJuegoCuestionario(alumnoId: number) {
  //   this.socket.emit ('respuestaJuegoDeCuestionario', alumnoId);
  // }
}


