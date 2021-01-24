import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, AlertController, Platform, IonSlides } from '@ionic/angular';
import { CalculosService, ComServerService } from '../servicios';
import { Alumno, Juego, TablaAlumnoJuegoDeCuestionario } from '../clases';
import { Cuestionario } from '../clases/Cuestionario';
import { Pregunta } from '../clases/Pregunta';
import { AlumnoJuegoDeCuestionario } from '../clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';
import { MiAlumnoAMostrarJuegoDeCuestionario } from '../clases/MiAlumnoAMostrarJuegoDeCuestionario';
import { RespuestaJuegoDeCuestionario } from '../clases/RespuestaJuegoDeCuestionario';
import {MatStepper} from '@angular/material';

import * as URL from '../URLs/urls';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-juego-de-cuestionario',
  templateUrl: './juego-de-cuestionario.page.html',
  styleUrls: ['./juego-de-cuestionario.page.scss'],
})
export class JuegoDeCuestionarioPage implements OnInit {

  empezado = false;

  alumnoId: number;
  alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
  juegoSeleccionado: any;
  cuestionario: Cuestionario;
  PreguntasCuestionario: Pregunta[] = [];
  descripcion = '';
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  respuestasPosibles: string[] = [];
  RespuestaEscogida: string;
  RespuestasAlumno: string[] = [];
  Nota = 0;
  puntuacionMaxima = 0;
  NotaInicial = '';
  feedbacks: string[] = [];
  Modalidad: string;

  // Con este array establecemos la posicion donde estara colocada la respuesta correcta en cada una de las preguntas
  ordenRespuestaCorrecta: number[] = [2, 3, 0, 1, 2, 0, 3, 1, 1, 0, 2];

  // Caso de un cuestionario con preguntas mezcladas
  nuevaOrdenacion: number[] = [];
  PreguntasCuestionarioOrdenadas: Pregunta[];

  // Caso de un cuestionario con respuestas mezcladas tambien
  todasRespuestas: string[] = [];
  mezclaRespuestas: string[] = [];
  numeroDeRespuestas = 0;
  tiempoLimite: number;
  tiempoRestante: number;
  timer;
  contar = false;

  // Datos juego de cuestionario finalizado
  MisAlumnosDelJuegoDeCuestionario: MiAlumnoAMostrarJuegoDeCuestionario[];
  reorden: AlumnoJuegoDeCuestionario[];
  nickName: string;
  cuestionarioRapido = false;
  seleccion: boolean[][];
  imagenesPreguntas: string [] = [];


  slideActual = 0;
  registrado = false;
  preguntasYRespuestas: any[];
  alumnosDelJuego: Alumno[];
  listaAlumnosOrdenadaPorNota: AlumnoJuegoDeCuestionario[];
  rankingAlumnosPorNota: TablaAlumnoJuegoDeCuestionario[];


  disablePrevBtn = true;
  disableNextBtn = false;

  contestar: boolean[];
  respuestasEmparejamientos: any[];

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;


  // @ViewChild('stepper') stepper: MatStepper;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper;

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private route: Router,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private comServer: ComServerService
  ) {
  }




  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.tiempoLimite = this.juegoSeleccionado.TiempoLimite;

    this.Modalidad = this.juegoSeleccionado.Modalidad;

    if (this.juegoSeleccionado.Tipo === 'Juego De Cuestionario') {
      // Obtenemos la inscripcion del alumno al juego de cuestionario
      this.alumnoId = this.sesion.DameAlumno().id;
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionario(this.alumnoId, this.juegoSeleccionado.id)
      .subscribe (res => {
        this.alumnoJuegoDeCuestionario = res[0];
  
        if (!this.alumnoJuegoDeCuestionario.Contestado) {
  
            // Obtenemos el cuestionario a realizar
            this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(res => {
              this.cuestionario = res;
              this.descripcion = res.Descripcion;
            });
            // Obtenemos las preguntas del cuestionario y ordenamos preguntas/respuestas en funcion a lo establecido en el cuestionario
            this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(res => {
              this.seleccion = [];
              this.PreguntasCuestionario = res;
              this.contestar = Array(this.PreguntasCuestionario.length).fill (true);

              this.preguntasYRespuestas = [];
              this.PreguntasCuestionario.forEach (p => {
                let r: any;
                if (p.Tipo === 'Cuatro opciones') {
                // tslint:disable-next-line:max-line-length
                  r = [p.RespuestaCorrecta, p.RespuestaIncorrecta1, p.RespuestaIncorrecta2, p.RespuestaIncorrecta3];
                } else if (p.Tipo === 'Emparejamiento') {
                  r = [];
                  p.Emparejamientos.forEach (pareja => r.push (pareja.r));
                }
                this.preguntasYRespuestas.push ({
                  pregunta: p,
                  respuestas: r,
                });
              });
              console.log ('preguntas y respuestas preparadas');
              console.log (this.preguntasYRespuestas);
              if (this.juegoSeleccionado.Presentacion === 'Mismo orden para todos') {
                this.DesordenarRespuestas ();
              } else if (this.juegoSeleccionado.Presentacion === 'Preguntas desordenadas') {
                this.DesordenarPreguntas ();
              } else {
                console.log ('preguntas y respuestas desordenadas');
                this.DesordenarPreguntasYRespuestas ();
              }
              console.log ('todo preparado');
              console.log (this.preguntasYRespuestas);
              this.imagenesPreguntas = [];
              for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
                  this.seleccion[i] = [];
                  for (let j = 0; j < 4; j++) {
                      this.seleccion[i][j] = false;
                  }
                  this.imagenesPreguntas [i] = URL.ImagenesPregunta + this.preguntasYRespuestas[i].pregunta.Imagen;
              }
            });
           

        } else {
            // el cuestionario ya ha sido contestado
            this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(res => {
              this.cuestionario = res;
              this.descripcion = res.Descripcion;
            });
            this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(res => {
              this.seleccion = [];
     
              this.PreguntasCuestionario = res;
       
              this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;

              this.peticionesAPI.DameRespuestasAlumnoJuegoDeCuestionario (this.alumnoJuegoDeCuestionario.id)
              .subscribe (respuestas => {
                console.log ('ya tengo las respuestas');
                console.log (respuestas);
                this.RespuestasAlumno = [];
                this.respuestasEmparejamientos = [];
                this.imagenesPreguntas = [];
                this.contestar = [];
                for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
                  this.imagenesPreguntas [i] = URL.ImagenesPregunta + this.PreguntasCuestionario[i].Imagen;
                  if (this.PreguntasCuestionario[i].Tipo === 'Emparejamiento') {
                    // tslint:disable-next-line:max-line-length
                    this.respuestasEmparejamientos[i] = respuestas.filter (r => r.preguntaId === this.PreguntasCuestionario[i].id)[0].Respuesta;
                    if (this.respuestasEmparejamientos[i] === undefined) {
                      this.contestar[i] = false;
                      this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);

                    } else {
                      this.contestar[i] = true;
                      // Vamos a ver si a respuesta es correcta
                      let cont = 0;
                      for (let j = 0; j < this.PreguntasCuestionario[i].Emparejamientos.length; j++) {
                        if (this.PreguntasCuestionario[i].Emparejamientos[j].r === this.respuestasEmparejamientos[i][j]) {
                          cont++;
                        }
                      }
                      if (cont === this.PreguntasCuestionario[i].Emparejamientos.length) {
                        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackCorrecto);
                      } else {
                        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);
                      }

                    }

                  } else {
                    // tslint:disable-next-line:max-line-length
                    this.RespuestasAlumno[i] = respuestas.filter (respuesta => respuesta.preguntaId === this.PreguntasCuestionario[i].id)[0].Respuesta[0];
                    if (this.RespuestasAlumno[i] ===  this.PreguntasCuestionario[i].RespuestaCorrecta) {
                      this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackCorrecto);
                    } else {
                      this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);
                    }

                  }
                }
              });
            });
            if (this.juegoSeleccionado.JuegoTerminado) {
              this.AlumnosDelJuego();
            }
        }

      });
    } else {
        // es un juego de cuestionario rápido
        this.alumnoJuegoDeCuestionario = new AlumnoJuegoDeCuestionario();
        this.NotaInicial = '0';
        this.nickName = this.sesion.DameNickName();
        this.cuestionarioRapido = true;
          // Obtenemos el cuestionario a realizar
        this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe(res => {
            this.cuestionario = res;
            this.descripcion = res.Descripcion;
          });
          // Obtenemos las preguntas del cuestionario y ordenamos preguntas/respuestas en funcion a lo establecido en el cuestionario
        // this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
        //   // tslint:disable-next-line:no-shadowed-variable
        //   .subscribe(res => {
        //     this.seleccion = [];
        //     this.PreguntasCuestionario = res;

        //     this.preguntasYRespuestas = [];
        //     this.PreguntasCuestionario.forEach (p => {
        //       // tslint:disable-next-line:max-line-length
        //       const r = [p.RespuestaCorrecta, p.RespuestaIncorrecta1, p.RespuestaIncorrecta2, p.RespuestaIncorrecta3];
        //       this.preguntasYRespuestas.push ({
        //         pregunta: p,
        //         respuestas: r,
        //       });
        //     });
        //     if (this.juegoSeleccionado.Presentacion === 'Mismo orden para todos') {
        //       this.DesordenarRespuestas ();
        //     } else if (this.juegoSeleccionado.Presentacion === 'Preguntas desordenadas') {
        //       this.DesordenarPreguntas ();
        //     } else {
        //       console.log ('preguntas y respuestas desordenadas');
        //       this.DesordenarPreguntasYRespuestas ();
        //     }
        //     console.log ('preguntas y respuestas');
        //     console.log (this.preguntasYRespuestas);
        //     this.imagenesPreguntas = [];
        //     for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
        //         this.seleccion[i] = [];
        //         for (let j = 0; j < 4; j++) {
        //             this.seleccion[i][j] = false;
        //         }
        //         this.imagenesPreguntas [i] = URL.ImagenesPregunta + this.preguntasYRespuestas[i].pregunta.Imagen;
        //     }
        //   });




        this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
          // tslint:disable-next-line:no-shadowed-variable
        .subscribe(res => {
            this.seleccion = [];
            this.PreguntasCuestionario = res;
            this.contestar = Array(this.PreguntasCuestionario.length).fill (true);

            this.preguntasYRespuestas = [];
            this.PreguntasCuestionario.forEach (p => {
              let r: any;
              if (p.Tipo === 'Cuatro opciones') {
              // tslint:disable-next-line:max-line-length
                r = [p.RespuestaCorrecta, p.RespuestaIncorrecta1, p.RespuestaIncorrecta2, p.RespuestaIncorrecta3];
              } else if (p.Tipo === 'Emparejamiento') {
                r = [];
                p.Emparejamientos.forEach (pareja => r.push (pareja.r));
              }
              this.preguntasYRespuestas.push ({
                pregunta: p,
                respuestas: r,
              });
            });
            console.log ('preguntas y respuestas preparadas');
            console.log (this.preguntasYRespuestas);
            if (this.juegoSeleccionado.Presentacion === 'Mismo orden para todos') {
              this.DesordenarRespuestas ();
            } else if (this.juegoSeleccionado.Presentacion === 'Preguntas desordenadas') {
              this.DesordenarPreguntas ();
            } else {
              console.log ('preguntas y respuestas desordenadas');
              this.DesordenarPreguntasYRespuestas ();
            }
            console.log ('todo preparado');
            console.log (this.preguntasYRespuestas);
            this.imagenesPreguntas = [];
            for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
                this.seleccion[i] = [];
                for (let j = 0; j < 4; j++) {
                    this.seleccion[i][j] = false;
                }
                this.imagenesPreguntas [i] = URL.ImagenesPregunta + this.preguntasYRespuestas[i].pregunta.Imagen;
            }
        });
    }
  }

  DesordenarVector(vector: any[]) {
    // genera una permutación aleatoria de los elementos del vector

    console.log ('estoy en funcion desordenar');
    console.log (vector);
    let currentIndex = vector.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = vector[currentIndex];
      vector[currentIndex] = vector[randomIndex];
      vector[randomIndex] = temporaryValue;
    }
    console.log ('he terminado');
  }

  DesordenarPreguntas () {
    this.DesordenarVector (this.preguntasYRespuestas);
  }
  DesordenarRespuestas() {
    this.preguntasYRespuestas.forEach (item => {
      if (item.pregunta.Tipo === 'Cuatro opciones' || item.pregunta.Tipo === 'Emparejamiento') {
        console.log ('voy a desordenar respuestas');
        this.DesordenarVector (item.respuestas);
        console.log (item.respuestas);
      }
    });
  }


  DesordenarPreguntasYRespuestas () {
    this.DesordenarPreguntas();
    this.DesordenarRespuestas();
  }
  

  radioGroupChange(event, i) {
    // ha elegido la respuesta j

    const j = event.detail.value;
    console.log ('item marcado');
    console.log (event);
    console.log (j);
    this.RespuestasAlumno[i] = this.preguntasYRespuestas[i].respuestas[j];

  }
  radioSelect(event, i, j) {

    const valor = this.seleccion [i][j];
    this.seleccion[i].fill(false);
    this.seleccion [i][j] = !valor;
  }


  ponerNota() {
 
    this.alertCtrl.create({
      header: '¿Seguro que quieres enviar ya tus respuestas?',
      buttons: [
        {
          text: 'SI',
          handler: () => {
          this.registrarNota();

          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('NO, ME QUEDO');
          }
        }
      ]
    }).then (res => res.present());
  }

  // Funcion para establecer la nota y guardar respuestas
  registrarNota() {
    // paramos el timer si está activo
    console.log ('vamos a poner nota');

    if (this.contar) {
      clearInterval(this.timer);
      this.contar = false;
      console.log ('paro el contador de tiempo');
    }
    this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;


    // Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
    // si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
      if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
        const final = this.preguntasYRespuestas[i].pregunta.Emparejamientos.length;
        if (!this.contestar[i]) {
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);

        } else {
          // tslint:disable-next-line:no-shadowed-variable
          let cont = 0;
          for (let j = 0; j < this.preguntasYRespuestas[i].pregunta.Emparejamientos.length; j++) {
            if (this.preguntasYRespuestas[i].pregunta.Emparejamientos[j].r === this.preguntasYRespuestas[i].respuestas[j]) {
              cont++;
            }
          }
          if (cont === this.preguntasYRespuestas[i].pregunta.Emparejamientos.length) {
            this.Nota = this.Nota + this.puntuacionCorrecta;
            this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
          } else {
            this.Nota = this.Nota - this.puntuacionIncorrecta;
            this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);
          }
        }
      } else {
        if (this.RespuestasAlumno[i] === this.preguntasYRespuestas[i].pregunta.RespuestaCorrecta) {
          console.log ('respuesta a la pregunta ' + i + ' es correcta');
          console.log (this.preguntasYRespuestas[i].pregunta);
          this.Nota = this.Nota + this.puntuacionCorrecta;
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
        } else if (this.RespuestasAlumno[i] === undefined) {
          this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);
        } else {
          console.log ('respuesta a la pregunta ' + i + ' es incorrecta');
          console.log (this.preguntasYRespuestas[i].pregunta);
          this.Nota = this.Nota - this.puntuacionIncorrecta;
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);
        }
      }
    }
    if (this.Nota <= 0) {
      this.Nota = 0;
    }
    const tiempoEmpleado = this.tiempoLimite - this.tiempoRestante;
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario ( this.Nota, true, this.juegoSeleccionado.id, this.alumnoId, tiempoEmpleado), this.alumnoJuegoDeCuestionario.id)
      .subscribe(res => {
        console.log ('ya he puesto nota');
        console.log(res);
      });

    console.log ('vamos a registrar las respuestas');
    // Aqui guardamos las respuestas del alumno
    let cont = 0;
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
      console.log ('respuesta a la pregunta ' + i);
      console.log (this.RespuestasAlumno[i]);
      if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
        this.RespuestasAlumno[i] = '-';
      }
      let respuestas;
      if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
        if (this.contestar[i]) {
          respuestas = this.preguntasYRespuestas[i].respuestas;
        } else {
          respuestas = undefined;
        }
      } else {
        respuestas = [];
        respuestas [0] = this.RespuestasAlumno[i];
      }
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaJuegoDeCuestionario(this.alumnoJuegoDeCuestionario.id, this.preguntasYRespuestas[i].pregunta.id, respuestas))
        .subscribe(res => {
          console.log ('ya he guardado respuesta');
          console.log(res);
          cont++;
          if (cont === this.PreguntasCuestionario.length)  {
            this.registrado = true;
            // Notificamos respuesta al servidor
            this.comServer.Emitir ('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota, tiempo: tiempoEmpleado});
            console.log ('vamos a la pantalla de resultado');
            this.slides.slideTo (this.PreguntasCuestionario.length + 2);
          }
        });
    }
  }

  // En el caso de que el alumno le de al boton de salir despues de haber empezado el cuestionario
  // se activa esta funcion y en el caso de que acepte salir del cuestionario, se le pondrá un 0 en el examen
  // ionViewWillLeave() {
  //   if (this.contar && !this.registrado) {

  //     this.alertCtrl.create({
  //       header: '¿Seguro que quieres salir?',
  //       message: 'Si sales sacaras un 0',
  //       buttons: [
  //         {
  //           text: 'SI',
  //           handler: () => {
  //             this.Nota = 0;
  //             // tslint:disable-next-line:max-line-length
  //             this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario ( this.Nota, true, this.juegoSeleccionado.id, this.alumnoId ), this.alumnoJuegoDeCuestionario.id)
  //               .subscribe(res => {
  //                 console.log(res);
  //                 this.comServer.Emitir('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota});
  //               });
  //             this.route.navigateByUrl('tabs/inici');
  //           }
  //         }, {
  //           text: 'NO',
  //           role: 'cancel',
  //           handler: () => {
  //             console.log('NO, ME QUEDO');
  //           }
  //         }
  //       ]
  //     }).then (res => res.present());
  //   }

  // }


    
  canExit(): Observable <boolean> {
    // esta función se llamará cada vez que quedamos salir de la página
      const confirmacionObservable = new Observable <boolean>( obs => {


        if (this.contar && !this.registrado) {

          this.alertCtrl.create({
            header: '¿Seguro que quieres salir?',
            message: 'Si sales sacaras un 0',
            buttons: [
              {
                text: 'SI',
                handler: () => {
                  this.Nota = 0;
                  // tslint:disable-next-line:max-line-length
                  this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario ( this.Nota, true, this.juegoSeleccionado.id, this.alumnoId ), this.alumnoJuegoDeCuestionario.id)
                    .subscribe(res => {
                      console.log(res);
                      this.comServer.Emitir('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota});
                    });
                  obs.next (true);
                }
              }, {
                text: 'NO',
                role: 'cancel',
                handler: () => {
                  console.log('NO, ME QUEDO');
                  obs.next (false);
                }
              }
            ]
          }).then (res => res.present());
        } else {
          obs.next (true);
        }

      });

      return confirmacionObservable;
  }


  // Flag para ver si hemos empezado el cuestionario
  empezamos() {
    this.empezado = true;
  }

  // Volvemos a la pagina de inicio
  GoMisJuegos() {
    this.route.navigateByUrl('tabs/inici');
  }

  // Exit page
  public exitPage() {
    this.route.navigateByUrl('tabs/inici');
  }

  IniciarTimer() {
    if(this.juegoSeleccionado.Modalidad === "Test clásico"){
      if (this.tiempoLimite !== 0) {
      // el timer solo se activa si se ha establecido un tiempo limite
      this.contar = true; // para que se muestre la cuenta atrás
      this.tiempoRestante = this.tiempoLimite;
      this.timer = setInterval(async () => {
            this.tiempoRestante = this.tiempoRestante - 1;
            if (this.tiempoRestante === 0) {
              // salto al paso de cuestionario concluido
              clearInterval(this.timer);
              console.log ('Fin del tiempo');
              const confirm = await this.alertCtrl.create({
                header: 'Se te acabó el tiempo',
                message: 'Vamos a enviar tus respuestas',
                buttons: [
                    {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {
                      this.registrado = true;
                      if (this.juegoSeleccionado.Tipo === 'Juego De Cuestionario') {

                        this.registrarNota();
                      } else {
                        this.EnviarRespuesta();
                      }
                      this.slides.slideTo ( this.PreguntasCuestionario.length + 2);
                    }
                  }
                ]
              });
              await confirm.present();

            }

      }, 1000);
      }
    }else if(this.juegoSeleccionado.Modalidad === "Kahoot"){
      console.log("Me subscribo");
      this.comServer.EsperoAvanzarPregunta()
      .subscribe((mensaje)=>{
        console.log("SIGUIENTE");
        console.log(mensaje);
        this.stepper.next();
      });
      console.log("LLAMAMOS A EnviarConexionAlumnoKahoot");
      this.EnviarConexionAlumnoKahoot(this.alumnoId);
    }
  }


  async EnviarRespuesta() {
    /* Preparamos un mensaje con la siguiente informacion:
        Nota
        Tiempo empleado
        Id de las preguntas del cuestionario
        Respuestas
    */



    // paramos el timer si está activo
    if (this.contar) {
      clearInterval(this.timer);
      this.contar = false;
    }
    this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;
    console.log ('Respuestas');
    console.log (this.RespuestasAlumno);

    // Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
    // si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
   
    // Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
    // si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
      if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
        const final = this.preguntasYRespuestas[i].pregunta.Emparejamientos.length;
        if (!this.contestar[i]) {
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);

        } else {
          // tslint:disable-next-line:no-shadowed-variable
          let cont = 0;
          for (let j = 0; j < this.preguntasYRespuestas[i].pregunta.Emparejamientos.length; j++) {
            if (this.preguntasYRespuestas[i].pregunta.Emparejamientos[j].r === this.preguntasYRespuestas[i].respuestas[j]) {
              cont++;
            }
          }
          if (cont === this.preguntasYRespuestas[i].pregunta.Emparejamientos.length) {
            this.Nota = this.Nota + this.puntuacionCorrecta;
            this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
          } else {
            this.Nota = this.Nota - this.puntuacionIncorrecta;
            this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);
          }
        }
      } else {
        if (this.RespuestasAlumno[i] === this.preguntasYRespuestas[i].pregunta.RespuestaCorrecta) {
          console.log ('respuesta a la pregunta ' + i + ' es correcta');
          console.log (this.preguntasYRespuestas[i].pregunta);
          this.Nota = this.Nota + this.puntuacionCorrecta;
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
        } else if (this.RespuestasAlumno[i] === undefined) {
          this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);
        } else {
          console.log ('respuesta a la pregunta ' + i + ' es incorrecta');
          console.log (this.preguntasYRespuestas[i].pregunta);
          this.Nota = this.Nota - this.puntuacionIncorrecta;
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);
        }
      }
    }

    // for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
    //   if (this.RespuestasAlumno[i] === this.preguntasYRespuestas[i].pregunta.RespuestaCorrecta) {

    //     this.Nota = this.Nota + this.puntuacionCorrecta;
    //     this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
    //   } else {

    //     this.Nota = this.Nota - this.puntuacionIncorrecta;
    //     this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);

    //   }
    // }
    if (this.Nota <= 0) {
      this.Nota = 0;
    }

    const tiempoEmpleado = this.tiempoLimite - this.tiempoRestante;

    // Marcamos con '-' las respuestas que han quedado en blanco
    // for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
    //   console.log ('respuesta a la pregunta ' + i);
    //   console.log (this.RespuestasAlumno[i]);
    //   if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
    //     this.RespuestasAlumno[i] = '-';
    //   }
    // }



    const todasLasRespuestas: any [] = [];
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
      console.log ('respuesta a la pregunta ' + i);
      console.log (this.RespuestasAlumno[i]);
      if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
        this.RespuestasAlumno[i] = '-';
      }
      let respuestas;
      if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
        if (this.contestar[i]) {
          respuestas = this.preguntasYRespuestas[i].respuestas;
        } else {
          respuestas = undefined;
        }
      } else {
        respuestas = [];
        respuestas [0] = this.RespuestasAlumno[i];
      }
      todasLasRespuestas.push (respuestas);
      // // tslint:disable-next-line:max-line-length
      // this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaJuegoDeCuestionario(this.alumnoJuegoDeCuestionario.id, this.preguntasYRespuestas[i].pregunta.id, respuestas))
      //   .subscribe(res => {
      //     console.log ('ya he guardado respuesta');
      //     console.log(res);
      //     cont++;
      //     if (cont === this.PreguntasCuestionario.length)  {
      //       this.registrado = true;
      //       // Notificamos respuesta al servidor
      //       this.comServer.Emitir ('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota, tiempo: tiempoEmpleado});
      //       console.log ('vamos a la pantalla de resultado');
      //       this.slides.slideTo (this.PreguntasCuestionario.length + 2);
      //     }
      //   });
    }






    const preguntas: number[] = [];
    this.preguntasYRespuestas.forEach (item => preguntas.push (item.pregunta.id));
    let respuesta: any = [];
    respuesta = {
      Nota: this.Nota,
      Tiempo: tiempoEmpleado,
      Preguntas: preguntas,
      Respuestas: todasLasRespuestas
    };

    this.comServer.Emitir ('respuestaCuestionarioRapido',
      { nick: this.nickName,
        respuestas: respuesta
      }
    );
     // Ahora añado la respuesta a los datos del juego para guardarlo en la base de datos
    // Asi las respuestas no se perderán si el dashboard no está conectado al juego
    // Pero primero me traigo de nuevo el juego por si ha habido respuestas despues de que
    // me lo traje
    this.peticionesAPI.DameJuegoDeCuestionarioRapido (this.juegoSeleccionado.Clave)
    .subscribe ( juego => {
      juego[0].Respuestas.push (
        { nick: this.nickName,
          respuestas: respuesta
      });
      console.log ('ya he preparado las respuestas');
      console.log (juego[0]);
      this.peticionesAPI.ModificarJuegoDeCuestionarioRapido (juego[0]).subscribe();
    });
    this.registrado = true;

    const confirm = await this.alertCtrl.create({
      header: 'Respuestas enviadas con éxito',
      message: 'Gracias por contestar el cuestionario',
      buttons: [
          {
          text: 'OK',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    await confirm.present();
  }

  Cerrar() {
    this.comServer.DesconectarJuegoRapido();
    this.route.navigateByUrl('/home');
  }


  //PARA LA MODALIDAD KAHOOT

  EnviarRespuestaKahoot(){
    this.comServer.EnviarRespuestaKahoot(this.alumnoId, this.RespuestaEscogida);
  }

  EnviarConexionAlumnoKahoot(alumnoId :number){
    this.comServer.EnviarConexionAlumnoKahoot(alumnoId);
  }

  Volver() {
  
    this.route.navigateByUrl('/inici');
  }


  EstoyConPregunta() {
    if ((this.slideActual >= 1) && (this.slideActual <= this.PreguntasCuestionario.length)) {
      return true;
    } else {
      return false;
    }
  }

  doCheck() {
 
    if (this.registrado) {
      console.log ('vamos al ultimo slide');
      this.slides.slideTo (this.PreguntasCuestionario.length + 2);
      this.slideActual = this.PreguntasCuestionario.length + 2;

    } else {
      this.slides.getActiveIndex().then(index => {

        console.log ('estamos en el slide ' + index);
        if (!this.registrado && index === this.PreguntasCuestionario.length + 2) {
          // pretende ir a la pantalla de resultado sin haber regitrado las respuestas
          console.log ('me quedo en el mismo slide');
          this.slides.slideTo (index - 1);
        } else if ((this.slideActual < index) && (index < this.PreguntasCuestionario.length + 1 )) {
            console.log ('voy a cambio respuestas siguiente');
           // this.cambioRespuestasSiguiente(index - 2);
        } else if ((this.slideActual > index) && (index > 0)) {
            console.log ('voy a cambio respuestas anterior');
          //  this.cambioRespuestasAnterior(index);
        }
        this.slideActual = index;


      });
    }
  }


  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }


  // Para cuando el juego está terminado, que ha que mostrar la clasificación

  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCuestionario(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorNota = inscripciones;
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorNota = this.listaAlumnosOrdenadaPorNota.sort(function(a, b) {
        if (b.Nota !== a.Nota) {
          return b.Nota - a.Nota;
        } else {
          // en caso de empate en la nota, gana el que empleó menos tiempo
          return a.TiempoEmpleado - b.TiempoEmpleado;
        }
      });
      this.TablaClasificacionTotal();
    });
  }

  TablaClasificacionTotal() {
    this.rankingAlumnosPorNota = this.calculos.PrepararTablaRankingCuestionario(this.listaAlumnosOrdenadaPorNota,
      this.alumnosDelJuego);
    console.log ('tengo el ranking');
    console.log (this.rankingAlumnosPorNota);

  }

 // Esta función se ejecuta cuando movemos a los conceptos de sitio
 reorderItems(event, i) {
    console.log ('voy a mover');
    console.log (this.preguntasYRespuestas[i].respuestas);
    const itemMove = this.preguntasYRespuestas[i].respuestas.splice(event.detail.from, 1)[0];
    console.log ('from ' + event.detail.from);
    
    console.log ('item ' + itemMove);
    console.log ('to ' + event.detail.to);
    this.preguntasYRespuestas[i].respuestas.splice(event.detail.to, 0, itemMove);
    console.log (this.preguntasYRespuestas[i].respuestas);
    event.detail.complete();
  }
  MarcarVerdaderoOFalso(event, i) {
    // ha elegido la respuesta j

    console.log ('item marcado');
    console.log (event.detail.value);
    const j = Number(event.detail.value);
    if (j === 0) {
      this.RespuestasAlumno[i] = 'verdadero';
      this.seleccion[i][0] = true;
      this.seleccion[i][1] = false;
      console.log ('marco verdadero');

    } else {
      this.RespuestasAlumno[i] = 'falso';
      this.seleccion[i][0] = false;
      this.seleccion[i][1] = true;
      console.log ('marco falso');
    }

  }
  

}
