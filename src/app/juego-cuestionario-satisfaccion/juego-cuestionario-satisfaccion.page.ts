import { Component, OnInit, ViewChild } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController, PickerController  } from '@ionic/angular';
import { CuestionarioSatisfaccion, Alumno, AlumnoJuegoDeCuestionarioSatisfaccion } from '../clases';
import {MatStepper} from '@angular/material';
import {PickerOptions} from '@ionic/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';







@Component({
  selector: 'app-juego-cuestionario-satisfaccion',
  templateUrl: './juego-cuestionario-satisfaccion.page.html',
  styleUrls: ['./juego-cuestionario-satisfaccion.page.scss'],
})
export class JuegoCuestionarioSatisfaccionPage implements OnInit {

  juegoSeleccionado: any;
  alumno: Alumno;
  inscripcionAlumnoJuegoDeCuestionarioSatisfaccion: AlumnoJuegoDeCuestionarioSatisfaccion;
  alumnos: Alumno[];
  cuestionarioSatisfaccion: CuestionarioSatisfaccion;
  empezado = false;
  RespuestaElegida: string;
  RespuestaAbierta: string;
  opcionesPicker: PickerOptions;
  pickerAction;
  seleccion: number[] = [];
  encuestaRapida = false;
  nickName: string;

  disablePrevBtn = true;
  disableNextBtn = false;
  valores: number[] = [];
  valor: number;
  mostrarRange = false;
  indiceAnterior = 0;


  @ViewChild(MatStepper, { static: false }) stepper: MatStepper;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;


  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private pickerCtrl: PickerController,
    private comServer: ComServerService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameCuestionarioSatisfaccion (this.juegoSeleccionado.cuestionarioSatisfaccionId)
    .subscribe (cuestionario => {
      this.cuestionarioSatisfaccion = cuestionario;
      console.log ('ya tengo cuestionario');
      console.log (this.cuestionarioSatisfaccion);
    });
    if (this.juegoSeleccionado.Tipo === 'Juego De Cuestionario de Satisfacción') {
      this.alumno = this.sesion.DameAlumno();
      console.log ('Ya tengo el juego');
      console.log (this.juegoSeleccionado);

      // Traigo la inscripción del alumno
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionarioSatisfaccion(this.juegoSeleccionado.id, this.alumno.id)
      .subscribe (inscripcion => {
          this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion = inscripcion[0];
          console.log ('ya tengo la inscripcion');
          console.log (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion);
          if (!this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.Contestado) {
            this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones = [];
            this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasPreguntasAbiertas = [];
          }

      });
    } else {
      this.nickName = this.sesion.DameNickName();
      this.encuestaRapida = true;
      this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion = new AlumnoJuegoDeCuestionarioSatisfaccion (
        false,
        this.juegoSeleccionado.id,
        0
      );
      this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones = [];
      this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasPreguntasAbiertas = [];
    }
  }

  Avanzar (indice: number) {
    console.log ('Avanzo desde el slide: ' + indice);
    // si abandono uno de los slides correspondientes a la entrada de respuesta a afirmaciones
    // guardo el valor introducido
    if ((indice >= 1) && (indice <= this.cuestionarioSatisfaccion.Afirmaciones.length)) {
      this.valores[indice - 1] = this.valor;
      this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones[indice - 1] = this.valor;
    }
    // si voy a entrar en uno de los slides correspondientes a la entrada de respuesta a afirmaciones
    // muestro el valor que tiene en ese momento la respuesta a esa afirmación
    if ((indice >= 0) && (indice < this.cuestionarioSatisfaccion.Afirmaciones.length)) {
      console.log (' voy a mostrar: ' + this.valores[indice] );
      this.valor = this.valores[indice];
      this.mostrarRange = true;
    } else {
      this.mostrarRange = false;
    }
    console.log ( this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones);

  }

  Retroceder(indice: number ) {
    console.log ('Retrocedo desde el slide: ' + indice);
    // si abandono uno de los slides correspondientes a la entrada de respuesta a afirmaciones
    // guardo el valor introducido
    if ((indice >= 1) && (indice <= this.cuestionarioSatisfaccion.Afirmaciones.length)) {
      this.valores[indice - 1] = this.valor;
      this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones[indice - 1] = this.valor;

    }
     // si voy a entrar en uno de los slides correspondientes a la entrada de respuesta a afirmaciones
    // muestro el valor que tiene en ese momento la respuesta a esa afirmación
   
    if ((indice >= 2) && (indice <= this.cuestionarioSatisfaccion.Afirmaciones.length + 1)) {
      console.log (' voy a mostrar: ' + this.valores[indice - 2] );
      this.valor = this.valores[indice - 2];
      this.mostrarRange = true;
    } else {
      this.mostrarRange = false;
    }
    console.log ( this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones);
  
  }
  
  async next() {
    // const indice = await this.slides.getActiveIndex();
    // this.Avanzar (indice);
    this.slides.slideNext();
  }

  async prev() {
    // const indice = await this.slides.getActiveIndex();
    // this.Retroceder (indice);
    this.slides.slidePrev();
  }

  async getIndex() {
    // Si nos movemos desplazando los slides hay que hacer lo mismo que si nos movemos
    // oon los botones de ir alante o ir atras. Por eso tenemos que ver si estamos avanzando o
    // retrocediendo

    const indice = await this.slides.getActiveIndex();
    console.log ('Llego al slide ' + indice);
    if (indice > this.indiceAnterior) {
      this.Avanzar (this.indiceAnterior);
    } else {
      this.Retroceder (this.indiceAnterior);
    }
    this.indiceAnterior = indice;
  }

  async EnviarRespuesta() {
    console.log ('voy a enviar respuesta');
    console.log (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion);
    this.comServer.Emitir ('respuestaEncuestaRapida',
      { clave: this.juegoSeleccionado.Clave,
        nick: this.nickName,
        respuestas: this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion
      }
    );
    // Ahora añado la respuesta a los datos del juego para guardarlo en la base de datos
    // Asi las respuestas no se perderán si el dashboard no está conectado al juego
    // Pero primero me traigo de nuevo el juego por si ha habido respuestas despues de que
    // me lo traje
    this.peticionesAPI.DameJuegoDeEncuestaRapida (this.juegoSeleccionado.Clave)
    .subscribe ( juego => {
      console.log ('recupero juego');
      console.log (juego[0]);
      juego[0].Respuestas.push (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion);
      console.log ('voy a modificar el juego ');
      console.log (juego[0]);
      this.peticionesAPI.ModificarJuegoDeEncuestaRapida (juego[0]).subscribe();
    });
  
    const confirm = await this.alertCtrl.create({
      header: 'Respuestas enviadas con éxito',
      message: 'Gracias por contestar la encuesta',
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
    this.comServer.DesconectarJuegoRapido();
    this.route.navigateByUrl('/home');
  }

  Registrar() {
    console.log ('voy a registrar');
    console.log (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion);
    this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.Contestado = true;
    this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeCuestionarioSatisfaccion (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion)
    .subscribe (async () => {
      const confirm = await this.alertCtrl.create({
        header: 'Respuestas registradas con éxito',
        message: 'Gracias por contestar la encuesta',
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
    });

  }
  // GuardaRespuesta (i : number) {
  //   console.log ('La respuesta para la pregunta ' + i + ' es ' + this.RespuestaElegida);
  //   this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones[i] = Number (this.RespuestaElegida);
  // }

  GuardaRespuestaAbierta (i: number, ev) {
    this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasPreguntasAbiertas[i] = ev.target.value;
  }
  // Guarda(ev) {
  //   this.RespuestaAbierta = ev.target.value;
  // }

  async MuestraPicker(i: number) {

    // Por alguna razon las opciones del Picker hay que prepararlas cada
    // vez. Si lo hago una sola vez al principio no funciona

    this.opcionesPicker = {
      buttons: [
        {
          text: 'Cancel',
          handler: value => {
            this.pickerAction = 'cancel';
          }
        },
        {
          text: 'Done',
          handler: value => {
            this.pickerAction = 'done';
          }
        }

      ],
      columns: [{
        name : "valoracion",
        options: [
          { text: '1', value: 1},
          { text: '2', value: 2},
          { text: '3', value: 3},
          { text: '4', value: 4},
          { text: '5', value: 5}
         ]
      }]
    };
    if (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones[i] !== undefined) {
      this.opcionesPicker.columns[0].selectedIndex = this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones[i] - 1;
    }

    const picker = await this.pickerCtrl.create(this.opcionesPicker);
    picker.present();
    picker.onDidDismiss ().then ( async data => {
      if (this.pickerAction === 'done') {
          const col = await picker.getColumn ("valoracion");
          console.log ('pongo en ' + i + 'el valor ' + col.options[col.selectedIndex].value )
          this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion.RespuestasAfirmaciones[i] = col.options[col.selectedIndex].value;
          this.seleccion[i] = col.options[col.selectedIndex].value;
      }
    });
  }

 
  doCheck() {
    // Para decidir si hay que mostrar los botones de previo o siguiente slide
    const prom1 = this.slides.isBeginning();
    const prom2 = this.slides.isEnd();
  
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

}
