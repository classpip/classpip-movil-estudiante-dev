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

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  async EnviarRespuesta() {
    console.log ('voy a enviar respuesta');
    console.log (this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion);
    this.comServer.Emitir ('respuestaEncuestaRapida',
      { nick: this.nickName,
        respuestas: this.inscripcionAlumnoJuegoDeCuestionarioSatisfaccion
      }
    );
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

 
  async getIndex() {
    const indice = await this.slides.getActiveIndex() - 1;
    if ((indice >= 0) && (indice < this.cuestionarioSatisfaccion.Afirmaciones.length)) {
      this.MuestraPicker (indice);
    }
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
