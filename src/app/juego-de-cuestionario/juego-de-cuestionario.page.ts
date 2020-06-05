import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { CalculosService } from '../servicios/calculos.service';
import { Juego } from '../clases';
import { Cuestionario } from '../clases/Cuestionario';
import { Pregunta } from '../clases/Pregunta';
import { AlumnoJuegoDeCuestionario } from '../clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';
import { MiAlumnoAMostrarJuegoDeCuestionario } from '../clases/MiAlumnoAMostrarJuegoDeCuestionario';
import { RespuestaAlumnoJuegoDeCuestionario } from '../clases/RespuestaAlumnoJuegoDeCuestionario';

@Component({
  selector: 'app-juego-de-cuestionario',
  templateUrl: './juego-de-cuestionario.page.html',
  styleUrls: ['./juego-de-cuestionario.page.scss'],
})
export class JuegoDeCuestionarioPage implements OnInit {

  empezado: boolean = false;

  alumnoId: number;
  alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
  juegoSeleccionado: Juego;
  cuestionario: Cuestionario;
  PreguntasCuestionario: Pregunta[];
  descripcion: string = '';
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  respuestasPosibles: string[] = [];
  RespuestaEscogida: string;
  RespuestasAlumno: string[] = [];
  Nota: number = 0;
  puntuacionMaxima: number = 0;
  NotaInicial: string = '';
  feedbacks: string[] = [];

  //Con este array establecemos la posicion donde estara colocada la respuesta correcta en cada una de las preguntas
  ordenRespuestaCorrecta: number[] = [2, 3, 0, 1, 2, 0, 3, 1, 1, 0, 2];

  //Caso de un cuestionario con preguntas mezcladas 
  nuevaOrdenacion: number[]= [];
  PreguntasCuestionarioOrdenadas: Pregunta[];

  //Caso de un cuestionario con respuestas mezcladas tambien
  todasRespuestas: string[] = [];
  mezclaRespuestas: string[] = [];
  numeroDeRespuestas: number = 0;

  //Datos juego de cuestionario finalizado
  MisAlumnosDelJuegoDeCuestionario: MiAlumnoAMostrarJuegoDeCuestionario[];
  reorden: AlumnoJuegoDeCuestionario[];

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private route: Router,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private alertCtrl: AlertController,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.alumnoId = this.sesion.DameAlumno().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    //Obtenemos la inscripcion del alumno al juego de cuestionario
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionario(this.alumnoId, this.juegoSeleccionado.id)
    .subscribe (res => {
      this.alumnoJuegoDeCuestionario = res;
      this.NotaInicial = res[0].Nota.toString();
    });
    //Obtenemos el cuestionario a realizar
    this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      this.cuestionario = res;
      this.descripcion = res.Descripcion;
    });
    //Obtenemos las preguntas del cuestionario y ordenamos preguntas/respuestas en funcion a lo establecido en el cuestionario
    this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      if (this.juegoSeleccionado.Presentacion !== 'Mismo orden para todos') {
        this.ordenarRespuestas(res)
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

        var i = 1;
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
    if (this.juegoSeleccionado.JuegoTerminado) {
      this.MisAlumnosDelJuegoDeCuestionario = this.calculos.DameListaAlumnosJuegoCuestionarioOrdenada(this.juegoSeleccionado.id);
    }
  }

  //Esta funcion coge el array en el cual se asigna la posicion de las respuestas correctas y lo
  //reordena en funcion al nuevo orden de las preguntas (ya el primer paso de la funcion es desordenar las preguntas) 
  ordenarRespuestas(preguntas: Pregunta[]) {
    this.PreguntasCuestionarioOrdenadas = preguntas;
    this.PreguntasCuestionario = this.desordenPreguntas(this.PreguntasCuestionarioOrdenadas);
    
    if (this.PreguntasCuestionarioOrdenadas !== this.PreguntasCuestionario ){
      for (var i = 0; i < this.PreguntasCuestionarioOrdenadas.length; i++) {
        for (var j = 0; j < this.PreguntasCuestionario.length; j++) {
          if (this.PreguntasCuestionarioOrdenadas[i] === this.PreguntasCuestionario[j]) {
            this.nuevaOrdenacion.splice(this.nuevaOrdenacion[i], 0, this.ordenRespuestaCorrecta[j]);
          }
        }
      }
      this.ordenRespuestaCorrecta = this.nuevaOrdenacion;
      
    }        
  }

  //Funcion para establecer las respuestas posibles de la siguiente pregunta que aparezca en el cuestinario
  cambioRespuestasSiguiente(i: number) {
    this.RespuestasAlumno.splice(i, 1, this.RespuestaEscogida);
    if (this.RespuestasAlumno[i+1] !== undefined) {
      this.RespuestaEscogida = this.RespuestasAlumno[i+1];
    } else if ((i+1) !== this.PreguntasCuestionario.length){
      this.RespuestaEscogida = '';
    } else {
      this.RespuestaEscogida = this.RespuestasAlumno[i];
    }

    if ((i+1) !== this.PreguntasCuestionario.length && this.juegoSeleccionado.Presentacion !== 'Preguntas y respuestas desordenadas'){
      this.respuestasPosibles = [];
      i = i + 1;
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
      this.respuestasPosibles.splice(this.ordenRespuestaCorrecta[i], 0, this.PreguntasCuestionario[i].RespuestaCorrecta);
    }

    if ((i+1) !== this.PreguntasCuestionario.length && this.juegoSeleccionado.Presentacion === 'Preguntas y respuestas desordenadas') {
      this.numeroDeRespuestas = this.numeroDeRespuestas + 4;
      this.respuestasPosibles = [];
      for (var i = this.numeroDeRespuestas; i < (this.numeroDeRespuestas + 4); i++){
        this.respuestasPosibles.push(this.todasRespuestas[i])
      }
      
    }
  }

  //Cargamos las respuestas posibles de la pregunta anterior
  cambioRespuestasAnterior(i: number) {
    this.RespuestaEscogida = this.RespuestasAlumno[i-1];
    this.respuestasPosibles = [];
    i = i - 1;
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
    this.respuestasPosibles.splice(this.ordenRespuestaCorrecta[i], 0, this.PreguntasCuestionario[i].RespuestaCorrecta);

    if (this.juegoSeleccionado.Presentacion === 'Preguntas y respuestas desordenadas') {
      this.numeroDeRespuestas = this.numeroDeRespuestas - 4;
      this.respuestasPosibles = [];
      for (var i = this.numeroDeRespuestas; i < (this.numeroDeRespuestas + 4); i++){
        this.respuestasPosibles.push(this.todasRespuestas[i])
      }
    }

  }

  //Desordenador de preguntas
  desordenPreguntas(datos: Pregunta[]): Pregunta[] {
    var currentIndex = datos.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = datos[currentIndex];
      datos[currentIndex] = datos[randomIndex];
      datos[randomIndex] = temporaryValue;
    }
    return datos
  }

  //Desordenador de respuestas
  desordenRespuestas(datos: string[]): string[] {
    var currentIndex = datos.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = datos[currentIndex];
      datos[currentIndex] = datos[randomIndex];
      datos[randomIndex] = temporaryValue;
    }
    return datos
  }

  //Funcion para establecer la nota y guardar respuestas
  ponerNota() {
    this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;
    
    //Para calcular la nota comprobamos el vector de respuestas con el de preguntas (mirando la respuesta correcta)
    //si es correcta sumamos, si es incorrecta restamos y en el caso de que la haya dejado en blanco ni suma ni resta
    for(var i = 0; i < this.PreguntasCuestionario.length; i++) {
      if (this.RespuestasAlumno[i] === this.PreguntasCuestionario[i].RespuestaCorrecta){
        this.Nota = this.Nota + this.puntuacionCorrecta;
        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackCorrecto);
      } else if (this.RespuestasAlumno[i] === "") {
        this.Nota = this.Nota;
        this.feedbacks.push('NO CONTESTADA');
      } else {
        this.Nota = this.Nota - this.puntuacionIncorrecta;
        this.feedbacks.push(this.PreguntasCuestionario[i].FeedbackIncorrecto);

      }
    }
    if (this.Nota <= 0) {
      this.Nota = 0.1;
    }
    
    this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario (this.alumnoId, this.juegoSeleccionado.id,
      this.Nota), this.alumnoJuegoDeCuestionario[0].id)
      .subscribe(res => {
        console.log(res);
      });

    //Aqui guardamos las respuestas del alumno
    for(var i = 0; i < this.PreguntasCuestionario.length; i++) {
      if (this.RespuestasAlumno[i] === "") {
        this.RespuestasAlumno[i] = "NO CONTESTADA";
      }
      this.peticionesAPI.GuardarRespuestaAlumnoJuegoDeCuestionario(new RespuestaAlumnoJuegoDeCuestionario(this.PreguntasCuestionario[i].id, this.alumnoJuegoDeCuestionario[0].id,
        this.RespuestasAlumno[i]))
        .subscribe(res => {
          console.log(res);
        });
    }
  }

  //En el caso de que el alumno le de al boton de salir despues de haber empezado el cuestionario
  //se activa esta funcion y en el caso de que acepte salir del cuestionario, se le pondrá un 0 en el examen
  async popup() {
    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres salir?',
      message: 'Si sales sacaras un 0',
      buttons: [
        {
          text: 'SI',
          handler: () => {
            this.Nota = 0.1;
              this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario (this.alumnoId, this.juegoSeleccionado.id,
              this.Nota), this.alumnoJuegoDeCuestionario[0].id)
              .subscribe(res => {
                console.log(res);
              });
            this.route.navigateByUrl('tabs/inici');
          }
        },{
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

  //Flag para ver si hemos empezado el cuestionario
  empezamos() {
    this.empezado = true;
  }

  //Volvemos a la pagina de inicio
  GoMisJuegos() {
    this.route.navigateByUrl('tabs/inici');
  }

  //Exit page
  public exitPage() {
    this.route.navigateByUrl('tabs/inici');
  }
}
