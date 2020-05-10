import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { CalculosService } from '../servicios/calculos.service';
import { Juego } from '../clases';
import { Cuestionario } from '../clases/Cuestionario';
import { Pregunta } from '../clases/Pregunta';
import { AlumnoJuegoDeCuestionario } from '../clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
  ordenRespuestaCorrecta: number[] = [2, 3, 0, 1, 2, 0, 3, 1, 1, 0, 2];

  //Caso de un cuestionario con preguntas mezcladas 
  nuevaOrdenacion: number[]= [];
  PreguntasCuestionarioOrdenadas: Pregunta[];

  //Caso de un cuestionario con respuestas mezcladas tambien
  todasRespuestas: string[] = [];
  mezclaRespuestas: string[] = [];
  numeroDeRespuestas: number = 0;

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
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionario(this.alumnoId, this.juegoSeleccionado.id)
    .subscribe (res => {
      this.alumnoJuegoDeCuestionario = res;
      this.NotaInicial = res[0].Nota.toString();
      console.log(this.NotaInicial);
    });
    this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      this.cuestionario = res;
      console.log(this.cuestionario)
      this.descripcion = res.Descripcion;
    });
    this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res=>{
      if (this.juegoSeleccionado.Presentacion !== 'Mismo orden para todos') {
        console.log(res);
        this.ordenarRespuestas(res)
      } else {
        this.PreguntasCuestionario = res;
        console.log('---------')
      }
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta1);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta2);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta3);
      this.respuestasPosibles.splice(this.ordenRespuestaCorrecta[0], 0, res[0].RespuestaCorrecta);
      if (this.juegoSeleccionado.Presentacion === 'Preguntas y respuestas desordenadas') {
        this.respuestasPosibles = this.desordenRespuestas(this.respuestasPosibles);
        this.todasRespuestas = this.respuestasPosibles;
        console.log(this.todasRespuestas);
        console.log(this.PreguntasCuestionario[1].RespuestaCorrecta);

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
          console.log('HOLA');
          console.log(this.mezclaRespuestas);
          console.log(this.todasRespuestas);
        }
      }
    });
  }

  ordenarRespuestas(preguntas: Pregunta[]) {
    console.log('POR LO MENOS ENTRA');
    this.PreguntasCuestionarioOrdenadas = preguntas;
    this.PreguntasCuestionario = this.desordenPreguntas(this.PreguntasCuestionarioOrdenadas);

        if (this.PreguntasCuestionarioOrdenadas[0] !== this.PreguntasCuestionario[0]){
          console.log('no entro nunca');
          for (var i = 0; i < this.PreguntasCuestionarioOrdenadas.length; i++) {
            for (var j = 0; j < this.PreguntasCuestionario.length; j++) {
              if (this.PreguntasCuestionarioOrdenadas[i] === this.PreguntasCuestionario[j]) {
                this.nuevaOrdenacion.splice(this.nuevaOrdenacion[i], 0, this.ordenRespuestaCorrecta[j]);
              }
            }
          }
          console.log(this.nuevaOrdenacion);
          console.log(this.ordenRespuestaCorrecta);
          this.ordenRespuestaCorrecta = this.nuevaOrdenacion;
          
        }        
  }

  cambioRespuestasSiguiente(i: number) {
    this.RespuestasAlumno.splice(i, 1, this.RespuestaEscogida);
    if (this.RespuestasAlumno[i+1] !== undefined) {
      this.RespuestaEscogida = this.RespuestasAlumno[i+1];
    } else if ((i+1) !== this.PreguntasCuestionario.length){
      this.RespuestaEscogida = '';
    } else {
      this.RespuestaEscogida = this.RespuestasAlumno[i];
    }
    
    console.log(this.RespuestasAlumno);
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

  ponerNota() {
    this.puntuacionMaxima = this.puntuacionCorrecta * this.PreguntasCuestionario.length;
    
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
    if (this.Nota < 0) {
      this.Nota = 0.1;
    }
    console.log(this.Nota);
    console.log(this.feedbacks);
    
    this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario (this.alumnoId, this.juegoSeleccionado.id,
      this.Nota), this.alumnoJuegoDeCuestionario[0].id)
      .subscribe(res => {
        console.log(res);
      });
  }

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
            console.log('NO');
          }
        }
      ]
    });
    await confirm.present();
  }
  /* async ionViewWillLeave() {
    this.ionViewCanLeave();
    if(!this.confirmedExit) {
      const confirm = await this.alertCtrl.create({
        header: '¿Seguro que quieres salir?',
        message: 'Si sales sacaras un 0',
        buttons: [
          {
            text: 'SI',
            role: 'cancel',
            handler: () => {
              console.log('SI');
            }
          },{
            text: 'NO',
            handler: () => {
              console.log('NO');
            }
          }
        ]
      });
      await confirm.present();

      return false;
    }
  }

  ionViewCanLeave(): boolean {
    if (!this.confirmedExit) {
      return false;
    } else {
      return true;
    }
  } */

  empezamos() {
    this.empezado = true;
  }
  GoMisJuegos() {
    this.route.navigateByUrl('tabs/inici');
  }

  public exitPage() {
    this.route.navigateByUrl('tabs/inici');
  }
}
