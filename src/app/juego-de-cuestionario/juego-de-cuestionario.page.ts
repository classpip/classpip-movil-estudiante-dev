import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { CalculosService, ComServerService } from '../servicios';
import { Juego } from '../clases';
import { Cuestionario } from '../clases/Cuestionario';
import { Pregunta } from '../clases/Pregunta';
import { AlumnoJuegoDeCuestionario } from '../clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';
import { MiAlumnoAMostrarJuegoDeCuestionario } from '../clases/MiAlumnoAMostrarJuegoDeCuestionario';
import { RespuestaJuegoDeCuestionario } from '../clases/RespuestaJuegoDeCuestionario';
import {MatStepper} from '@angular/material';


@Component({
  selector: 'app-juego-de-cuestionario',
  templateUrl: './juego-de-cuestionario.page.html',
  styleUrls: ['./juego-de-cuestionario.page.scss'],
})
export class JuegoDeCuestionarioPage implements OnInit {

  empezado = false;

  alumnoId: number;
  alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
  juegoSeleccionado: Juego;
  cuestionario: Cuestionario;
  PreguntasCuestionario: Pregunta[];
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
  ) { }

  ngOnInit() {

    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.tiempoLimite = this.juegoSeleccionado.TiempoLimite;
    if (this.juegoSeleccionado.Tipo === 'Juego De Cuestionario') {
      // Obtenemos la inscripcion del alumno al juego de cuestionario
      this.alumnoId = this.sesion.DameAlumno().id;
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionario(this.alumnoId, this.juegoSeleccionado.id)
      .subscribe (res => {
        this.alumnoJuegoDeCuestionario = res;
        this.NotaInicial = res[0].Nota.toString();
      });
      if (this.juegoSeleccionado.JuegoTerminado) {
        this.MisAlumnosDelJuegoDeCuestionario = this.calculos.DameListaAlumnosJuegoCuestionarioOrdenada(this.juegoSeleccionado.id);
      }
    } else {
        // es un juego de cuestionario rápido
        this.alumnoJuegoDeCuestionario = new AlumnoJuegoDeCuestionario();
        this.NotaInicial = '0';
        this.nickName = this.sesion.DameNickName();
        this.cuestionarioRapido = true;
    }
    // Obtenemos el cuestionario a realizar
    this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      this.cuestionario = res;
      this.descripcion = res.Descripcion;
    });
    // Obtenemos las preguntas del cuestionario y ordenamos preguntas/respuestas en funcion a lo establecido en el cuestionario
    this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      if (this.juegoSeleccionado.Presentacion !== 'Mismo orden para todos') {
        this.ordenarRespuestas(res);
      } else {
        this.PreguntasCuestionario = res;
      }
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta1);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta2);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta3);
      this.respuestasPosibles.splice(this.ordenRespuestaCorrecta[0], 0, res[0].RespuestaCorrecta);
      if (this.juegoSeleccionado.Presentacion === 'Preguntas y respuestas desordenadas') {
        this.respuestasPosibles = this.desordenRespuestas(this.respuestasPosibles);
        this.todasRespuestas = this.respuestasPosibles;

        let i = 1;
        while (i < this.PreguntasCuestionario.length) {
          this.mezclaRespuestas.push(res[i].RespuestaIncorrecta1);
          this.mezclaRespuestas.push(res[i].RespuestaIncorrecta2);
          this.mezclaRespuestas.push(res[i].RespuestaIncorrecta3);
          this.mezclaRespuestas.push(res[i].RespuestaCorrecta);
          this.mezclaRespuestas = this.desordenRespuestas(this.mezclaRespuestas);

          this.todasRespuestas = this.todasRespuestas.concat(this.mezclaRespuestas);

          i++;
          this.mezclaRespuestas = [];
        }
      }
    });
   
  }

  // Esta funcion coge el array en el cual se asigna la posicion de las respuestas correctas y lo
  // reordena en funcion al nuevo orden de las preguntas (ya el primer paso de la funcion es desordenar las preguntas)
  ordenarRespuestas(preguntas: Pregunta[]) {
    this.PreguntasCuestionarioOrdenadas = preguntas;
    this.PreguntasCuestionario = this.desordenPreguntas(this.PreguntasCuestionarioOrdenadas);

    if (this.PreguntasCuestionarioOrdenadas !== this.PreguntasCuestionario ) {
      for (let i = 0; i < this.PreguntasCuestionarioOrdenadas.length; i++) {
        for (let j = 0; j < this.PreguntasCuestionario.length; j++) {
          if (this.PreguntasCuestionarioOrdenadas[i] === this.PreguntasCuestionario[j]) {
            this.nuevaOrdenacion.splice(this.nuevaOrdenacion[i], 0, this.ordenRespuestaCorrecta[j]);
          }
        }
      }
      this.ordenRespuestaCorrecta = this.nuevaOrdenacion;

    }
  }

  // Funcion para establecer las respuestas posibles de la siguiente pregunta que aparezca en el cuestinario
  cambioRespuestasSiguiente(i: number) {
    console.log ('respuesta ' + i + ': ' + this.RespuestaEscogida);
    this.RespuestasAlumno.splice(i, 1, this.RespuestaEscogida);
    if (this.RespuestasAlumno[i + 1] !== undefined) {
      this.RespuestaEscogida = this.RespuestasAlumno[i + 1];
    } else if ((i + 1) !== this.PreguntasCuestionario.length) {
      this.RespuestaEscogida = undefined;
    } else {
      this.RespuestaEscogida = this.RespuestasAlumno[i];
    }

    if ((i + 1) !== this.PreguntasCuestionario.length && this.juegoSeleccionado.Presentacion !== 'Preguntas y respuestas desordenadas') {
      this.respuestasPosibles = [];
      i = i + 1;
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
      this.respuestasPosibles.splice(this.ordenRespuestaCorrecta[i], 0, this.PreguntasCuestionario[i].RespuestaCorrecta);
    }

    if ((i + 1) !== this.PreguntasCuestionario.length && this.juegoSeleccionado.Presentacion === 'Preguntas y respuestas desordenadas') {
      this.numeroDeRespuestas = this.numeroDeRespuestas + 4;
      this.respuestasPosibles = [];
      for (let i = this.numeroDeRespuestas; i < (this.numeroDeRespuestas + 4); i++) {
        this.respuestasPosibles.push(this.todasRespuestas[i]);
      }

    }
  }

  // Cargamos las respuestas posibles de la pregunta anterior
  cambioRespuestasAnterior(i: number) {
    this.RespuestaEscogida = this.RespuestasAlumno[i - 1];
    this.respuestasPosibles = [];
    i = i - 1;
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
    this.respuestasPosibles.splice(this.ordenRespuestaCorrecta[i], 0, this.PreguntasCuestionario[i].RespuestaCorrecta);

    if (this.juegoSeleccionado.Presentacion === 'Preguntas y respuestas desordenadas') {
      this.numeroDeRespuestas = this.numeroDeRespuestas - 4;
      this.respuestasPosibles = [];
      for (let i = this.numeroDeRespuestas; i < (this.numeroDeRespuestas + 4); i++) {
        this.respuestasPosibles.push(this.todasRespuestas[i]);
      }
    }

  }

  // Desordenador de preguntas
  desordenPreguntas(datos: Pregunta[]): Pregunta[] {
    let currentIndex = datos.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = datos[currentIndex];
      datos[currentIndex] = datos[randomIndex];
      datos[randomIndex] = temporaryValue;
    }
    return datos;
  }

  // Desordenador de respuestas
  desordenRespuestas(datos: string[]): string[] {
    let currentIndex = datos.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = datos[currentIndex];
      datos[currentIndex] = datos[randomIndex];
      datos[randomIndex] = temporaryValue;
    }
    return datos;
  }

  // Funcion para establecer la nota y guardar respuestas
  ponerNota() {
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
    for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
      if (this.RespuestasAlumno[i] === this.PreguntasCuestionario[i].RespuestaCorrecta) {
        this.Nota = this.Nota + this.puntuacionCorrecta;
        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackCorrecto);
      } else if (this.RespuestasAlumno[i] === undefined) {
        this.feedbacks.push(' ');
      } else {
        this.Nota = this.Nota - this.puntuacionIncorrecta;
        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);

      }
    }
    if (this.Nota <= 0) {
      this.Nota = 0.1;
    }
    const tiempoEmpleado = this.tiempoLimite - this.tiempoRestante;
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario ( this.Nota, true, this.juegoSeleccionado.id, this.alumnoId, tiempoEmpleado), this.alumnoJuegoDeCuestionario[0].id)
      .subscribe(res => {
        console.log ('ya he puesto nota');
        console.log(res);
      });

    console.log ('vamos a registrar las respuestas');
    // Aqui guardamos las respuestas del alumno
    let cont = 0;
    for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
      console.log ('respuesta a la pregunta ' + i);
      console.log (this.RespuestasAlumno[i]);
      if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
        this.RespuestasAlumno[i] = '-';
      }
      // tslint:disable-next-line:max-line-length
      this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaJuegoDeCuestionario(this.alumnoJuegoDeCuestionario[0].id, this.PreguntasCuestionario[i].id,
        this.RespuestasAlumno[i]))
        .subscribe(res => {
          console.log ('ya he guardado respuesta');
          console.log(res);
          cont++;
          if (cont === this.PreguntasCuestionario.length)  {
            // Notificamos respuesta al servidor
            this.comServer.Emitir ('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota, tiempo: tiempoEmpleado});
          }
        });
    }
  }

  // En el caso de que el alumno le de al boton de salir despues de haber empezado el cuestionario
  // se activa esta funcion y en el caso de que acepte salir del cuestionario, se le pondrá un 0 en el examen
  async popup() {
    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres salir?',
      message: 'Si sales sacaras un 0',
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.Nota = 0.1;
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario ( this.Nota, true, this.juegoSeleccionado.id, this.alumnoId ), this.alumnoJuegoDeCuestionario[0].id)
              .subscribe(res => {
                console.log(res);
                this.comServer.Emitir('respuestaJuegoDeCuestionario', { id: this.alumnoId, nota: this.Nota});
              });
            this.route.navigateByUrl('tabs/inici');
          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('NO, ME QUEDO');
          }
        }
      ]
    });
    await confirm.present();
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
      // el timer solo se activa si se ha establecido un tiempo limite
      this.contar = true; // para que se muestre la cuenta atrás
      this.tiempoRestante = this.tiempoLimite;
      this.timer = setInterval(async () => {
            this.tiempoRestante = this.tiempoRestante - 1;
            if (this.tiempoRestante === 0) {
              // salto al paso de cuestionario concluido
        
              const confirm = await this.alertCtrl.create({
                header: 'Se te acabó el tiempo',
                message: 'Vamos a enviar tus respuestas',
                buttons: [
                    {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {
                      if (this.juegoSeleccionado.Tipo === 'Juego de Cuestionario') {
                        this.ponerNota();
                      } else {
                        this.EnviarRespuesta();
                      }
                      this.stepper.selectedIndex = this.PreguntasCuestionario.length + 3;
                    }
                  }
                ]
              });
              await confirm.present();

            }

      }, 1000);
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
    for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
      if (this.RespuestasAlumno[i] === this.PreguntasCuestionario[i].RespuestaCorrecta) {
        this.Nota = this.Nota + this.puntuacionCorrecta;
        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackCorrecto);
      } else if (this.RespuestasAlumno[i] === undefined) {
        this.feedbacks.push(' ');
      } else {
        this.Nota = this.Nota - this.puntuacionIncorrecta;
        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);

      }
    }
    if (this.Nota <= 0) {
      this.Nota = 0.1;
    }
    const tiempoEmpleado = this.tiempoLimite - this.tiempoRestante;

    console.log ('vamos a registrar las respuestas');
    // Aqui guardamos las respuestas del alumno
    for (let i = 0; i < this.PreguntasCuestionario.length; i++) {
      console.log ('respuesta a la pregunta ' + i);
      console.log (this.RespuestasAlumno[i]);
      if ((this.RespuestasAlumno[i] === '') || (this.RespuestasAlumno[i] === undefined)) {
        this.RespuestasAlumno[i] = '-';
      }
    }

    const preguntas: number[] = [];
    this.PreguntasCuestionario.forEach (pregunta => preguntas.push (pregunta.id));
    let respuesta: any = [];
    respuesta = {
      Nota: this.Nota,
      Tiempo: tiempoEmpleado,
      Preguntas: preguntas,
      Respuestas: this.RespuestasAlumno
    };
  
    console.log ('voy a enviar respuesta');
    console.log (respuesta);
    this.comServer.Emitir ('respuestaCuestionarioRapido',
      { nick: this.nickName,
        respuestas: respuesta
      }
    );
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
}
