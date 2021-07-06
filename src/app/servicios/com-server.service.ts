import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Alumno, AlumnoJuegoDeCompeticionFormulaUno } from '../clases/index';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComServerService {
  profesorId: number;

  constructor(private servidor: Socket) { }
  Conectar(alumno: Alumno) {
    this.profesorId = alumno.profesorId;
    this.servidor.connect();
    this.servidor.emit('alumnoConectado', alumno);
  }
  Desconectar(alumno: Alumno) {
    console.log ('voy a desconectar');
    this.servidor.emit('alumnoDesconectado', alumno);
    this.servidor.disconnect();
  }

  Emitir(mensaje: string, informacion: any) {
    console.log ('voy a emitir');
    console.log (mensaje);
    console.log (informacion);
    this.servidor.emit(mensaje, { profesorId: this.profesorId, info: informacion});
  }

  EnviarNick(profesorId: number, nick: string) {
    // Como el alumno no se ha conectado por la via normal, no tenemos guardado el identificador
    // del profesor. Por eso lo tenemos que recibir como parámetro
    this.servidor.connect();
    this.profesorId = profesorId;
    console.log ('envio nick: ' + nick);
    console.log (this.servidor);
    // tslint:disable-next-line:object-literal-shorthand
    this.servidor.emit('nickNameJuegoRapido', { profesorId: this.profesorId, info: nick});
  }

  EnviarNickYRegistrar(profesorId: number, nick: string, clave: string) {
    // Como el alumno no se ha conectado por la via normal, no tenemos guardado el identificador
    // del profesor. Por eso lo tenemos que recibir como parámetro.
    // Ademas, hay que registrar al alumno para que reciba notificaciones en este juego rapido
    this.servidor.connect();
    this.profesorId = profesorId;
    // tslint:disable-next-line:object-literal-shorthand
    this.servidor.emit('nickNameJuegoRapidoYRegistro', { profesorId: this.profesorId, info: nick, c: clave});
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
    this.servidor.emit ('recordarPassword' , {email: alumno.Email, nombre: alumno.Username, contrasena: alumno.Password});
  }

  //Para la función de avanzar pregunta Kahoot
  public EsperoAvanzarPregunta(): any {
    console.log("Me voy a subscribir");
    return Observable.create((observer) => {
        this.servidor.on('avanzarPregunta', (mensaje) => {
            console.log ('AVANZo PREGUNTA');
            console.log (mensaje);
            observer.next(mensaje);
        });
    });
  }

  //MÉTODOS NECESARIOS, PARA LA INTERACCIÓN DASHBOARD-SERVER, EN LA MODALIDAD KAHOOT

  //Para enviar respuesta al Dashboard en modalidad Kahoot
  public EnviarRespuestaKahoot(alumnoId: number, respuestaEscogida: string){
    console.log("Envio la respuesta del alumno a Dashboard");
    this.servidor.emit('respuestaAlumnoKahoot', { alumnoId: alumnoId, respuesta: respuestaEscogida, profesorId: this.profesorId});

  }

  //Para enviar al Server la conexión al juego, del alumno, en la modalidad Kahoot
  public EnviarConexionAlumnoKahoot(alumnoId :number){
    console.log("Envio la conexión del alumno al Server");
    this.servidor.emit('conexionAlumnoKahoot', { alumnoId: alumnoId, profesorId: this.profesorId});

  }

  ConfirmarPreparadoParaKahoot(id: any) {
    // Si el juego es rápido el id es el nickname pero si es juego normal entonces el id es el id del alumno
    // tslint:disable-next-line:object-literal-shorthand
    this.servidor.emit('confirmacionPreparadoParaKahoot', { profesorId: this.profesorId, info: id});
  }
  //Para la función de avanzar pregunta Kahoot
  public EsperoParaLanzarPregunta(): any {
    return Observable.create((observer) => {
        this.servidor.on('lanzarSiguientePregunta', (opcionesDesordenadas) => {
            observer.next(opcionesDesordenadas);
        });
    });
  }

  public EnviarRespuestaKahootRapido(nickName: string, respuestasAlumno: string[], tiempo: number, puntos:  number){
    // tslint:disable-next-line:max-line-length
    this.servidor.emit('respuestaAlumnoKahootRapido', { nick: nickName, respuesta: respuestasAlumno, tiempoRestante: tiempo, puntosObtenidos: puntos, profesorId: this.profesorId});

  }

  public EnviarRespuestaKahootGrupo(alId: number, respuestasAlumno: string[], tiempo: number, puntos:  number){
    // tslint:disable-next-line:max-line-length
    this.servidor.emit('respuestaAlumnoKahootGrupo', { alumnoId: alId, respuesta: respuestasAlumno, tiempoRestante: tiempo, puntosObtenidos: puntos, profesorId: this.profesorId});

  }
  
  public EsperoResultadoFinalKahoot(): any {
    return Observable.create((observer) => {
        this.servidor.on('resultadoFinalKahoot', (resultado) => {
            observer.next(resultado);
        });
    });
  }

  public EnviarResultadoEvaluacion(alumnoId: number, profesorId: number, juegoId: number, evaluadoId: number, respuesta: any): any {
      this.servidor.emit('respuestaEvaluacion', {alumnoId, profesorId, juegoId, evaluadoId, respuesta});
  }
}


