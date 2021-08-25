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

  contestar: boolean[] = [];
  respuestasEmparejamientos: any[];
  preguntaAMostrar: Pregunta;
  imagenPreguntaAMostrar: string;
  cuentaAtras: number;
  interval;

  cuentaAtras2: number;
  interval2;
  finDelJuego = false;
  siguiente: number;
  tengoResultadoDelJuego = false;
  resultadoJuego: string;
  opcionesDesordenadas: any[];
  contestarEmparejamiento = true;
  clasificacion: any;
  respuestasKahoot: any[] = [];
  styles: any;
  puntosTotales: number; // acumula los puntos recibidos en el juego Kahoot
  respuestasPreparadas = false;

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
    platform.ready().then(() => {
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      this.styles = {
        height : this.platform.height(),
        width : this.platform.width()
      };
    });
  }

  // esto es pasa asignar el tamaño del slide dinamicamente, segun la plataforma en la que se ejecuta
  // el código
  // Parece que funciona porque se adapta tanto al simulador web como al acceso web desde el movil
  // pero al descargar la app sobre el movil no puedo entrar (debe dar un error)
  // la verdad es que no tengo claro que funcione.

  getStyles(): any {
    console.log ('cojo estilos');
    return this.styles;

  }

  ionViewWillEnter () {
    console.log ('empezamos por Enter');
    this.slideActual = 0;
    this.ngOnInit();
  }

  ngOnInit() {

    // El juego de cuestionario será siempre de grupo porque los juegos rápidos se han movido a ClasspipExpress
    // El juego puede ser clásico o kahoot
   
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('empezamos');

    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.tiempoLimite = this.juegoSeleccionado.TiempoLimite;

    this.Modalidad = this.juegoSeleccionado.Modalidad;

    // Seguro que la siguiente condición es cierta porque aqui ya no hay juego rápido
    // De momento lo dejo pero esto tiene que desaparecer
    if (this.juegoSeleccionado.Tipo === 'Juego De Cuestionario') {
      console.log ('juego de cuestionario');
      // Obtenemos la inscripcion del alumno al juego de cuestionario
      this.alumnoId = this.sesion.DameAlumno().id;
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionario(this.alumnoId, this.juegoSeleccionado.id)
      .subscribe (res => {
        this.alumnoJuegoDeCuestionario = res[0];
        console.log ('datos del alumno', this.alumnoJuegoDeCuestionario);
  
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
              this.PreguntasCuestionario = res;

              if (this.juegoSeleccionado.Modalidad === 'Clásico') {
                this.PrepararPreguntasYRespuestas();
              }
            });
            if (this.juegoSeleccionado.Modalidad === 'Kahoot') {
              // Indico lo que haré cuando reciba los resultados finales del juego en el caso del Kahoot
              this.comServer.EsperoResultadoFinalKahoot ()
              .subscribe (resultado => {
                this.tengoResultadoDelJuego = true;
                this.clasificacion = resultado;
                // El resultado final del juego Kahoot es una lista con en la que cada elemento 
                // tiene: 
                //    alumno
                //    puntos
              });
            }
           

        } else {
            console.log ('cuestionario contestado', this.alumnoJuegoDeCuestionario);
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
                // respuestas es un vector en el que casa posición tiene la respuesta a una de las preguntas.
                // La estructura de cada respuesta es la siguiente:
                //    preguntaId
                //    Respuesta     (un vector que contiene en la posición 0 la respuesta del alumno en el caso de preguntas
                // de tipo "Cuatro opciones", "Verdadero o falso" o "Respuesta abierta". En el caso de "Emparejamiento" el vector
                // contiene las partes derechas de los emparejamientos tal y como lo eligió el alumno, o undefined si contestó en blanco)
   
                console.log ('respuestas ', respuestas);
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
                this.respuestasPreparadas = true;
              });
            });
            if (this.juegoSeleccionado.JuegoTerminado) {
              // traigo la información de todos los alumnos del grupo para presentar la clasificación final
              this.AlumnosDelJuego();
            }
        }

      });
    }
  }

  PrepararPreguntasYRespuestas() {
    // Aqui preparamos una lista con las preguntas, las opciones de respuesta y  un vector de imágenes de las preguntas
    this.seleccion = [];
    this.contestar = Array(this.PreguntasCuestionario.length).fill (true);

    // En esta lista vamos a guardar las preguntas con las opciones de respuesta de cada una de ellas, si las hay
    // Eso nos permitirá desordenar las opciones de respuestas, si hay que hacerlo
    this.preguntasYRespuestas = [];
    this.PreguntasCuestionario.forEach (p => {
      let r: any;
      if (p.Tipo === 'Cuatro opciones') {
      // tslint:disable-next-line:max-line-length
        // este es el vector de posibles respuestas
        r = [p.RespuestaCorrecta, p.RespuestaIncorrecta1, p.RespuestaIncorrecta2, p.RespuestaIncorrecta3];
      } else if (p.Tipo === 'Emparejamiento') {
        r = [];
        // guardamos las opciones de respuesta
        p.Emparejamientos.forEach (pareja => r.push (pareja.r));
      }
      // aquí guardamos la pregunta y las opciones de respuesta para poder desordenarlas si hace falta
      this.preguntasYRespuestas.push ({
        pregunta: p,
        respuestas: r,
      });
    });

    if (this.juegoSeleccionado.Presentacion === 'Mismo orden para todos') {
      this.DesordenarRespuestas ();
    } else if (this.juegoSeleccionado.Presentacion === 'Preguntas desordenadas') {
      this.DesordenarPreguntas ();
    } else {
      this.DesordenarPreguntasYRespuestas ();
    }

    // Preparamos el vector con las imagenes de las preguntas e inicializamos la matriz que controla la selección de opciones

    this.imagenesPreguntas = [];
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
        this.seleccion[i] = [];
        for (let j = 0; j < 4; j++) {
            this.seleccion[i][j] = false;
        }
        this.imagenesPreguntas [i] = URL.ImagenesPregunta + this.preguntasYRespuestas[i].pregunta.Imagen;
    }

  }
  DesordenarVector(vector: any[]) {
    // genera una permutación aleatoria de los elementos del vector


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

  }
  DesordenarPreguntas () {
    this.DesordenarVector (this.preguntasYRespuestas);
  }
  DesordenarRespuestas() {
    this.preguntasYRespuestas.forEach (item => {
      if (item.pregunta.Tipo === 'Cuatro opciones' || item.pregunta.Tipo === 'Emparejamiento') {
        this.DesordenarVector (item.respuestas);
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
    this.RespuestasAlumno[i] = this.preguntasYRespuestas[i].respuestas[j];

  }
  radioSelect(event, i, j) {
    // Tengo que poner a false todas las opciones de la pregunta i, menos la opción
    // elegida, que es la j, en la que tengo que poner la negación de lo que había
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
          this.RegistrarNota();

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

  // Funcion para establecer la nota y guardar respuestas en el caso de juego de cuestionario normal
  RegistrarNota() {
    // paramos el timer si está activo

    if (this.contar) {
      clearInterval(this.timer);
      this.contar = false;
    }
    this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;


    // Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
    // si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
      if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
        const final = this.preguntasYRespuestas[i].pregunta.Emparejamientos.length;
        // En el vector contestar registré si la pregunta se dejó en blanco
        if (!this.contestar[i]) {
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);

        } else {
          // El alumno contestó a la pregunta de emparejamiento. En ese caso, su respuesta está en el propio
          // vector de preguntas y respuestas. Alli quedaron las partes derechas de los emparejamientos tal y como los
          // ha dejado el alumno
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
        // Para cualquier otro tipo de pregunta, la respuesta está en el vector RespuestasAlumno
        // Si en ese vector hay un undefined es que la respuesta quedó en blanco
        if (this.RespuestasAlumno[i] === this.preguntasYRespuestas[i].pregunta.RespuestaCorrecta) {
          this.Nota = this.Nota + this.puntuacionCorrecta;
          this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
        } else if (this.RespuestasAlumno[i] === undefined) {
          this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);
        } else {
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

    });

    // Aqui guardamos las respuestas del alumno
    let cont = 0;
    for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
      // para cada pregunta preparo en el vector respuestas la respuesta del alumno para guardarla en la base de datos

      if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
        this.RespuestasAlumno[i] = '-';
      }
      let respuestas;
      if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
        // la respuesta es undefined si quedó en blanco o la lista de partes derechas de emparejamientos tal y como las dejó el alumno
        if (this.contestar[i]) {
          respuestas = this.preguntasYRespuestas[i].respuestas;
        } else {
          respuestas = undefined;
        }
      } else {
        // En cualquier otro caso, la respuesta está en RespuestasALumno y se guarda en la posición 0 del vector respuestas
        respuestas = [];
        respuestas [0] = this.RespuestasAlumno[i];
      }
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaJuegoDeCuestionario(this.alumnoJuegoDeCuestionario.id, this.preguntasYRespuestas[i].pregunta.id, respuestas))
        .subscribe(res => {

          cont++;
          if (cont === this.PreguntasCuestionario.length)  {
            this.registrado = true;
            // Notificamos respuesta al servidor
            this.comServer.Emitir ('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota, tiempo: tiempoEmpleado});
            // vamos a la pantalla que muestra el resultado final
            this.slides.slideTo (this.PreguntasCuestionario.length + 2);
          }
        });
    }
  }
    
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
    if (this.tiempoLimite !== 0) {
      // este timer solo se activa en el modo clásico si se ha establecido un tiempo limite
      this.contar = true; // para que se muestre la cuenta atrás
      this.tiempoRestante = this.tiempoLimite;
      this.empezado = true;
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
                      this.RegistrarNota();
                      this.slides.slideTo ( this.PreguntasCuestionario.length + 2);
                    }
                  }
                ]
              });
              await confirm.present();

            }

      }, 1000);
    }
  }


  // async EnviarRespuesta() {
  //   /* Preparamos un mensaje con la siguiente informacion:
  //       Nota
  //       Tiempo empleado
  //       Id de las preguntas del cuestionario
  //       Respuestas
  //   */



  //   // paramos el timer si está activo
  //   if (this.contar) {
  //     clearInterval(this.timer);
  //     this.contar = false;
  //   }
  //   this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;
  //   console.log ('Respuestas');
  //   console.log (this.RespuestasAlumno);

  //   // Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
  //   // si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
   
  //   // Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
  //   // si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
  //   for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
  //     if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
  //       const final = this.preguntasYRespuestas[i].pregunta.Emparejamientos.length;
  //       if (!this.contestar[i]) {
  //         this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);

  //       } else {
  //         // tslint:disable-next-line:no-shadowed-variable
  //         let cont = 0;
  //         for (let j = 0; j < this.preguntasYRespuestas[i].pregunta.Emparejamientos.length; j++) {
  //           if (this.preguntasYRespuestas[i].pregunta.Emparejamientos[j].r === this.preguntasYRespuestas[i].respuestas[j]) {
  //             cont++;
  //           }
  //         }
  //         if (cont === this.preguntasYRespuestas[i].pregunta.Emparejamientos.length) {
  //           this.Nota = this.Nota + this.puntuacionCorrecta;
  //           this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
  //         } else {
  //           this.Nota = this.Nota - this.puntuacionIncorrecta;
  //           this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);
  //         }
  //       }
  //     } else {
  //       if (this.RespuestasAlumno[i] === this.preguntasYRespuestas[i].pregunta.RespuestaCorrecta) {
  //         console.log ('respuesta a la pregunta ' + i + ' es correcta');
  //         console.log (this.preguntasYRespuestas[i].pregunta);
  //         this.Nota = this.Nota + this.puntuacionCorrecta;
  //         this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
  //       } else if (this.RespuestasAlumno[i] === undefined) {
  //         this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);
  //       } else {
  //         console.log ('respuesta a la pregunta ' + i + ' es incorrecta');
  //         console.log (this.preguntasYRespuestas[i].pregunta);
  //         this.Nota = this.Nota - this.puntuacionIncorrecta;
  //         this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);
  //       }
  //     }
  //   }

  //   // for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
  //   //   if (this.RespuestasAlumno[i] === this.preguntasYRespuestas[i].pregunta.RespuestaCorrecta) {

  //   //     this.Nota = this.Nota + this.puntuacionCorrecta;
  //   //     this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackCorrecto);
  //   //   } else {

  //   //     this.Nota = this.Nota - this.puntuacionIncorrecta;
  //   //     this.feedbacks.push(this.preguntasYRespuestas[i].pregunta.FeedbackIncorrecto);

  //   //   }
  //   // }
  //   if (this.Nota <= 0) {
  //     this.Nota = 0;
  //   }

  //   const tiempoEmpleado = this.tiempoLimite - this.tiempoRestante;

  //   // Marcamos con '-' las respuestas que han quedado en blanco
  //   // for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
  //   //   console.log ('respuesta a la pregunta ' + i);
  //   //   console.log (this.RespuestasAlumno[i]);
  //   //   if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
  //   //     this.RespuestasAlumno[i] = '-';
  //   //   }
  //   // }



  //   const todasLasRespuestas: any [] = [];
  //   for (let i = 0; i < this.preguntasYRespuestas.length; i++) {
  //     console.log ('respuesta a la pregunta ' + i);
  //     console.log (this.RespuestasAlumno[i]);
  //     if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
  //       this.RespuestasAlumno[i] = '-';
  //     }
  //     let respuestas;
  //     if (this.preguntasYRespuestas[i].pregunta.Tipo === 'Emparejamiento') {
  //       if (this.contestar[i]) {
  //         respuestas = this.preguntasYRespuestas[i].respuestas;
  //       } else {
  //         respuestas = undefined;
  //       }
  //     } else {
  //       respuestas = [];
  //       respuestas [0] = this.RespuestasAlumno[i];
  //     }
  //     todasLasRespuestas.push (respuestas);
  //     // // tslint:disable-next-line:max-line-length
  //     // this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaJuegoDeCuestionario(this.alumnoJuegoDeCuestionario.id, this.preguntasYRespuestas[i].pregunta.id, respuestas))
  //     //   .subscribe(res => {
  //     //     console.log ('ya he guardado respuesta');
  //     //     console.log(res);
  //     //     cont++;
  //     //     if (cont === this.PreguntasCuestionario.length)  {
  //     //       this.registrado = true;
  //     //       // Notificamos respuesta al servidor
  //     //       this.comServer.Emitir ('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota, tiempo: tiempoEmpleado});
  //     //       console.log ('vamos a la pantalla de resultado');
  //     //       this.slides.slideTo (this.PreguntasCuestionario.length + 2);
  //     //     }
  //     //   });
  //   }






  //   const preguntas: number[] = [];
  //   this.preguntasYRespuestas.forEach (item => preguntas.push (item.pregunta.id));
  //   let respuesta: any = [];
  //   respuesta = {
  //     Nota: this.Nota,
  //     Tiempo: tiempoEmpleado,
  //     Preguntas: preguntas,
  //     Respuestas: todasLasRespuestas
  //   };

  //   this.comServer.Emitir ('respuestaCuestionarioRapido',
  //     { nick: this.nickName,
  //       respuestas: respuesta
  //     }
  //   );
  //    // Ahora añado la respuesta a los datos del juego para guardarlo en la base de datos
  //   // Asi las respuestas no se perderán si el dashboard no está conectado al juego
  //   // Pero primero me traigo de nuevo el juego por si ha habido respuestas despues de que
  //   // me lo traje
  //   this.peticionesAPI.DameJuegoDeCuestionarioRapido (this.juegoSeleccionado.Clave)
  //   .subscribe ( juego => {
  //     juego[0].Respuestas.push (
  //       { nick: this.nickName,
  //         respuestas: respuesta
  //     });
  //     console.log ('ya he preparado las respuestas');
  //     console.log (juego[0]);
  //     this.peticionesAPI.ModificarJuegoDeCuestionarioRapido (juego[0]).subscribe();
  //   });
  //   this.registrado = true;

  //   const confirm = await this.alertCtrl.create({
  //     header: 'Respuestas enviadas con éxito',
  //     message: 'Gracias por contestar el cuestionario',
  //     buttons: [
  //         {
  //         text: 'OK',
  //         role: 'cancel',
  //         handler: () => {

  //         }
  //       }
  //     ]
  //   });
  //   await confirm.present();
  // }





  Cerrar() {
    this.cuentaAtras2 = 0;
    this.cuentaAtras = 0;
    this.siguiente = 0;
    this.empezado = false;
    this.route.navigateByUrl('/inici');
  }


  //PARA LA MODALIDAD KAHOOT

  // EnviarRespuestaKahoot(){
  //   this.comServer.EnviarRespuestaKahoot(this.alumnoId, this.RespuestaEscogida);
  // }

  // EnviarConexionAlumnoKahoot(alumnoId: number) {
  //   // Cuando el alumno pulse el botón de empezar se enviará esta notificación que hará que el dash ponga el nombre del alumno en verde
  //   this.comServer.EnviarConexionAlumnoKahoot(alumnoId);
  // }

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
    if (this.juegoSeleccionado.Modalidad === 'Kahoot') {
      console.log ('estamos en do check');
      if (!this.alumnoJuegoDeCuestionario.Contestado) {

        this.slides.getActiveIndex().then(index => {
          if (index === 0 && this.empezado) {
            // no podemos retroceder
            this.slides.slideTo (1);

          } else if (index === 1 && !this.empezado) {
            // Solo podemos empezar si pulsamos el botón
            this.slides.slideTo(0);
          } else if (index === 2 && !this.finDelJuego) {
            // no podemos avanzar hasta que acabe el juevo
            this.slides.slideTo (1);
          } else {
            this.slideActual = index;
          }
        });
      } else {
        this.slides.getActiveIndex().then(index => {
          this.slideActual = index;
        });
      }

    } else {
  
      if (this.registrado) {
        // al registrar la respuesta nos vamos a la pantalla para mostrar resultados
        this.slides.slideTo (this.PreguntasCuestionario.length + 2);
        this.slideActual = this.PreguntasCuestionario.length + 2;

      } else {
        this.slides.getActiveIndex().then(index => {
          if (index === 1 && !this.empezado) {
            // Solo podemos empezar si pulsamos el botón
            this.slides.slideTo(0);
          }

          if (!this.registrado && index === this.PreguntasCuestionario.length + 2) {
            // pretende ir a la pantalla de resultado sin haber regitrado las respuestas
            this.slides.slideTo (index - 1);
          // } else if ((this.slideActual < index) && (index < this.PreguntasCuestionario.length + 1 )) {
          //     console.log ('voy a cambio respuestas siguiente');
          //   // this.cambioRespuestasSiguiente(index - 2);
          // } else if ((this.slideActual > index) && (index > 0)) {
          //     console.log ('voy a cambio respuestas anterior');
          //   //  this.cambioRespuestasAnterior(index);
          }
          this.slideActual = index;


        });
      }
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

  // Aqui venimos cuando el alumno participa en un juego modo Kahoot
  ConfirmarPreparado() {
    this.empezado = true;
    // if (this.juegoSeleccionado.Modalidad === 'Clásico') {
    // this.comServer.ConfirmarPreparadoParaKahoot (this.nickName);
    // } else {
    //   console.log ('confirmo preparado');
    //   this.comServer.ConfirmarPreparadoParaKahoot (this.alumnoId);
    // }
    this.comServer.ConfirmarPreparadoParaKahoot (this.alumnoId);
    this.EsperarYMostrarSiguientePregunta();

  }
  EsperarYMostrarSiguientePregunta () {
    this.siguiente = 0;
    this.imagenesPreguntas = [];
    this.puntosTotales = 0;


    this.comServer.EsperoParaLanzarPregunta ()
      .subscribe ( (opcionesDesordenadas) => {
        // cuando el dash indica que hay que avanzar a la pregunta siguiente nos envía el orden en que hay que mostrar
        // las opciones de respuesta
        this.RespuestasAlumno = [];
        this.contestarEmparejamiento = true;
        this.cuentaAtras = 3;
        // preparamos las varables con las que mostraremos las opciones de respuesta
        if (this.PreguntasCuestionario[this.siguiente].Tipo === 'Emparejamiento') {
          this.RespuestasAlumno = opcionesDesordenadas;
        } else {
          this.opcionesDesordenadas = opcionesDesordenadas;
        }

        this.interval = setInterval(() => {
     
          this.cuentaAtras--;

          if (this.cuentaAtras === 0) {
                clearInterval(this.interval);
                // Es el momento de mostrar la pregunta
                this.preguntaAMostrar = this.PreguntasCuestionario[this.siguiente];
                this.imagenPreguntaAMostrar =  URL.ImagenesPregunta + this.preguntaAMostrar.Imagen;
                // Guardamos la imagen para cuando haya que mostrar los resultados al alumno
                this.imagenesPreguntas.push (this.imagenPreguntaAMostrar);
                this.siguiente++;
                this.cuentaAtras2 = this.juegoSeleccionado.TiempoLimite;
                // ponemos el timer para contar tiempo de respuesta
                this.interval2 = setInterval(() => {
                  this.cuentaAtras2--;
                  if (this.cuentaAtras2 === 0) {
                        clearInterval(this.interval2);
                        // Se acabó el tiempo
                        console.log ('se acabo el tiempo');
                        this.CalcularPuntosYEnviar();
                        console.log ('Ya he enviado ', this.siguiente);
                        if (this.siguiente ===  this.PreguntasCuestionario.length) {
                          console.log ('Ya no hay mas');
                          // Ya no hay más preguntas
                          this.finDelJuego = true;
                          this.preguntaAMostrar = undefined;
                       
                          // tslint:disable-next-line:max-line-length
                          const registro = new AlumnoJuegoDeCuestionario ( this.puntosTotales, true, this.juegoSeleccionado.id, this.alumnoId, 0);
                          console.log ('actualizo el resultado en la base de datos ', registro);
                          // tslint:disable-next-line:max-line-length
                          this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(registro, this.alumnoJuegoDeCuestionario.id)
                          .subscribe();
                        }
                  }
                }, 1000);
          }
        }, 1000);
    });
  }
  CalcularPuntosYEnviar () {
        // Calculo los puntos que obtiene el alumno con esta respuesta
        let puntos;
        // Los puntos se calculan en una escala del 0 al 10 en proporción al número de segundos sobrantes.
        puntos = Math.round( (this.cuentaAtras2 * 10) / this.juegoSeleccionado.TiempoLimite);

        if (this.preguntaAMostrar.Tipo === 'Emparejamiento') {
          const final = this.preguntaAMostrar.Emparejamientos.length;
          if (!this.contestarEmparejamiento) {
            // La respuesta ha quedado en blanco
            this.feedbacks.push(this.preguntaAMostrar.FeedbackIncorrecto);
            this.RespuestasAlumno = undefined;
            puntos = 0;
    
          } else {
            // tslint:disable-next-line:no-shadowed-variable
            let cont = 0;
            for (let j = 0; j < this.preguntaAMostrar.Emparejamientos.length; j++) {
              if (this.preguntaAMostrar.Emparejamientos[j].r === this.RespuestasAlumno[j]) {
                cont++;
              }
            }
            if (cont === this.preguntaAMostrar.Emparejamientos.length) {
              puntos = this.cuentaAtras2; // los puntos son los segundos que le quedaban
              this.feedbacks.push(this.preguntaAMostrar.FeedbackCorrecto);
            } else {
              puntos = 0;
              this.feedbacks.push(this.preguntaAMostrar.FeedbackIncorrecto);
            }
          }
        } else {
          if (this.RespuestasAlumno[0] === this.preguntaAMostrar.RespuestaCorrecta) {
            puntos = this.cuentaAtras2; // los puntos son los segundos que le quedaban
            this.feedbacks.push(this.preguntaAMostrar.FeedbackCorrecto);
          } else {
            puntos = 0;
            this.feedbacks.push(this.preguntaAMostrar.FeedbackIncorrecto);
          }
        }
        if (this.preguntaAMostrar.Tipo === 'Emparejamiento') {
          this.contestar.push(this.contestarEmparejamiento);
        } else {
          this.contestar.push (undefined);
        }
        // Guardo las respuestas para poder mostrarlas al alumno al final, junto con los feedbacks
        this.respuestasKahoot.push (this.RespuestasAlumno);
        this.puntosTotales = this.puntosTotales + puntos;

        this.EnviarRespuestaKahoot (puntos);

  }
  EnviarRespuestaKahoot(puntos: number) {

    clearInterval(this.interval2);

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaJuegoDeCuestionario(this.alumnoJuegoDeCuestionario.id, this.preguntaAMostrar.id, this.RespuestasAlumno))
    .subscribe();

    this.comServer.EnviarRespuestaKahootGrupo(this.alumnoId, this.RespuestasAlumno, this.cuentaAtras2, puntos);
    if (this.siguiente ===  this.PreguntasCuestionario.length) {
      console.log ('Ya no hay mas');
      // Ya no hay más preguntas
      this.finDelJuego = true;

   
      // tslint:disable-next-line:max-line-length
      const registro = new AlumnoJuegoDeCuestionario ( this.puntosTotales, true, this.juegoSeleccionado.id, this.alumnoId, 0);
      console.log ('actualizo el resultado en la base de datos ', registro);
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(registro, this.alumnoJuegoDeCuestionario.id)
      .subscribe();
    }

    
    this.preguntaAMostrar = undefined;
    this.RespuestasAlumno = [];
  }

  GuardarRespuesta (respuesta) {
    this.RespuestasAlumno[0] = respuesta;
    this.CalcularPuntosYEnviar();

  }
  ReordenarRespuestas(event) {
    const itemMove = this.RespuestasAlumno.splice(event.detail.from, 1)[0];
    this.RespuestasAlumno.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }
  

}
