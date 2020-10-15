import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService } from '../servicios/sesion.service';
import { NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {
  Juego, Equipo, Alumno, MiAlumnoAMostrarJuegoDePuntos, Grupo,
  MiEquipoAMostrarJuegoDePuntos, Cromo, Coleccion
} from '../clases/index';

import { ModalController } from '@ionic/angular';
import { IntercambiarCromosPage } from '../intercambiar-cromos/intercambiar-cromos.page';

import 'hammerjs';
import { LongPressModule } from 'ionic-long-press';


import * as URL from '../URLs/urls';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-juego-colleccion',
  templateUrl: './juego-colleccion.page.html',
  styleUrls: ['./juego-colleccion.page.scss'],
})
export class JuegoColleccionPage implements OnInit {

  juegoSeleccionado: Juego;


  cromosQueTengoImagenDelante: string[] = [];
  cromosQueTengoImagenDetras: string[] = [];
  cromosQueNoTengoImagenDelante: string[] = [];
  cromosQueNoTengoImagenDetras: string[] = [];
  cromosQueTengo: any[] = [];
  cromosQueNoTengo: any[] = [];
  cromosSinRepetidos: any[];
  alumno: Alumno;
  equipo: Equipo;
  alumnosJuegoDeColeccion: Alumno[] = [];
  equiposJuegoDeColeccion: Equipo[] = [];

  sliderConfig: any;
  coleccion: Coleccion;
  protected interval: any;
  progress = 0;
  elem: any;
  pos: number;
  preparado: boolean = false;

  disablePrevBtn = true;
  disableNextBtn = false;




  @ViewChild(IonSlides, { static: false }) slides: IonSlides;



  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    public modalController: ModalController
  ) { }

  @ViewChild('content', { static: false }) content: IonContent;

  ngOnInit() {
    console.log ('entro en on init');
    this.sliderConfig = {
      slidesPerView: 1.6,
      spaceBetween: 10,
      centeredSlides: true
    };
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.alumno = this.sesion.DameAlumno();
    this.peticionesAPI.DameColeccion(this.juegoSeleccionado.coleccionId)
    .subscribe (coleccion => this.coleccion = coleccion);
    this.equipo = this.sesion.DameEquipo();
    if (this.juegoSeleccionado.Modo === 'Individual') {
     
      this.DameLosCromosDelAlumno();

    } else {
      this.DameLosCromosDelEquipo ();
      
    }
    // if (this.juegoSeleccionado.Modo === 'Individual') {
    //   this.DameLosCromosDelAlumno();
    //   this.petic.DameAlumnosJuegoDeColecciones(this.juegoSeleccionado.id)
    //   .subscribe ( (alumnos) =>  this.alumnosJuegoDeColeccion = alumnos);

    //   console.log('Estos son los alumnos del Juego de Col ' + this.juegoSeleccionado.id);
    //   console.log(this.alumnosJuegoDeColeccion);
    // } else {
    //   this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id).subscribe(
    //     listaEquipos => {
    //       this.equiposJuegoDeColeccion = listaEquipos;
    //       // this.DameEquipoAlumnoConectado();
    //       // console.log('Aquí están los equipos');
    //       // console.log(this.MisEquiposJuegoColecciones);
    //     });
    // }
  }
 // Interval function



 onPress(elem, i) {
    this.elem = elem;
    this.pos = i;
    this.startInterval();
 }

 onPressUp() {

     this.stopInterval();
 }

 startInterval() {
     const self = this;
     // tslint:disable-next-line:only-arrow-functions
     this.interval = setInterval(function() {
         self.progress = self.progress + 1;
         if (self.progress === 5) {
            self.stopInterval();
            self.progress = 0;
            self.RegalarCromo (self.elem, self.pos);
         }
     }, 1000);
 }

 stopInterval() {
     clearInterval(this.interval);
 }


  MostrarAlbum() {
    this.sesion.TomaColeccion (this.coleccion);
    this.sesion.TomaCromos (this.cromosQueTengo);
    this.navCtrl.navigateForward('/album-alumno');
  }

  async  RegalarCromo(elem, i) {
    // elem tiene el cromo y el número de repeticiones
    // i es la posición en el vector de cromos, para facilitar su eliminación
    if (elem.rep === 1) {
      const confirm = await this.alertCtrl.create({
        header: '¿Seguro que quieres regalar el cromo?',
        message: 'No lo tienes repetido. Te vas a quedar sin él',
        buttons: [
          {
            text: 'SI',
            handler: async () => {
              // preparo el cromo
              this.sesion.TomaCromo (elem.cromo);
              this.sesion.TomaAlumno (this.alumno);
              this.sesion.TomaEquipo (this.equipo);
              console.log ('vamos');
              const modal = await this.modalController.create({
                component: IntercambiarCromosPage,
                cssClass: 'my-custom-class',
              });
              await modal.present();
              const { data } = await modal.onWillDismiss();
              // En data me indica si ha regalado el cromo o no
              if (data.regalado) {
                // Como ha regalado el cromo y era la única copia que tenía de ese cromo
                // tengo que cambiar las listas de cromos que tengo y que no tengo, y las listas
                // con las imágenes

                 this.cromosSinRepetidos = this.cromosSinRepetidos.filter (e => e.cromo.id !== elem.cromo.id);
                 this.cromosQueTengoImagenDelante.splice (i , 1);
                 if (this.coleccion.DosCaras) {
                    this.cromosQueTengoImagenDetras.splice (i, 1);
                  }
                 elem.rep = 0; // me quedo sin copias de ese cromo
                 this.cromosQueNoTengo.push (elem);
                 this.cromosQueNoTengoImagenDelante.push ( URL.ImagenesCromo + elem.cromo.ImagenDelante);
                 if (this.coleccion.DosCaras)  {
                    this.cromosQueNoTengoImagenDetras.push ( URL.ImagenesCromo + elem.cromo.ImagenDetras);
                }
                 this.cromosQueTengo = this.cromosQueTengo.filter (c => c.id !== elem.cromo.id);
              }

            }
          }, {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              console.log('No regalo');
            }
          }
        ]
      });
      await confirm.present();
    } else {
      const confirm = await this.alertCtrl.create({
        header: '¿Seguro que quieres regalar el cromo?',
        message: 'Tienes ' + elem.rep + ' copias de este cromo.',
        buttons: [
          {
            text: 'SI',
            handler: async () => {
              this.sesion.TomaCromo (elem.cromo);
              const modal = await this.modalController.create({
                component: IntercambiarCromosPage,
                cssClass: 'my-custom-class',
              });
              await modal.present();
              const { data } = await modal.onWillDismiss();
              if (data.regalado) {
                // como se ha regalado el cromo tomo nota de que tengo una copia menos de ese cromo
                this.cromosSinRepetidos.filter (e => e.cromo.id === elem.cromo.id)[0].rep--;
              }
            }
          }, {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              console.log('No regalo');
            }
          }
        ]
      });
      await confirm.present();

    }
  }

  DameLosCromosDelEquipo() {
    console.log ('voy a por los cromos del equipo');

    // primero me traigo el equipo del alumno que participa en el juego
    this.calculos.DameEquipoAlumnoEnJuegoDeColeccion (this.alumno.id, this.juegoSeleccionado.id)
    .subscribe (equipo => {
      this.equipo = equipo;
      // Ahora traigo la inscripcion del equipo en el juego
      this.peticionesAPI.DameInscripcionEquipoJuegoDeColeccion(this.juegoSeleccionado.id, equipo.id)
      .subscribe(inscripcionEquipo => {
        // Y ahora me traigo los cromos del equipo
        this.peticionesAPI.DameCromosEquipo(inscripcionEquipo[0].id)
        .subscribe(CromosEquipo => {
            console.log('aquí están los cromos: ');
            console.log(CromosEquipo);
            // this.AlumnoMisCromos = CromosAlumno;
            this.cromosQueTengo = CromosEquipo;
            // this.AlumnolistaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosDelAlumno);
            this.cromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosQueTengo);
            // this.sesion.TomaCromosSinRepetidos(this.cromosSinRepetidos);
            this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
              todosLosCromos => {
                console.log('aqui estan todos los cromos');
                console.log(todosLosCromos);
               // this.AlumnoCromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.AlumnoMisCromos, TodosLosCromosAlumno);
                console.log ('cromos que tengo');
                console.log (this.cromosQueTengo);
                this.cromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.cromosQueTengo, todosLosCromos);
                console.log ('cromos que NO tengo');
                console.log (this.cromosQueNoTengo);
                this.PreparaImagenesCromosQueTengo();
                this.PreparaImagenesCromosQueFaltan();
                this.preparado = true;
              });
          });


      });


    });

  }


  DameLosCromosDelAlumno() {
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeColeccion(this.juegoSeleccionado.id, this.alumno.id).subscribe(
        InscripcionAlumno => {
          this.peticionesAPI.DameCromosAlumno(InscripcionAlumno[0].id).subscribe(
            CromosAlumno => {
              console.log('aquí están los cromos: ');
              console.log(CromosAlumno);
              // this.AlumnoMisCromos = CromosAlumno;
              this.cromosQueTengo = CromosAlumno;
              // this.AlumnolistaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosDelAlumno);

              this.cromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.cromosQueTengo);
              // this.sesion.TomaCromosSinRepetidos(this.cromosSinRepetidos);
              this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
                todosLosCromos => {
                  console.log('aqui estan todos los cromos');
                  console.log(todosLosCromos);
                 // this.AlumnoCromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.AlumnoMisCromos, TodosLosCromosAlumno);
                  console.log ('cromos que tengo');
                  console.log (this.cromosQueTengo);
                  this.cromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.cromosQueTengo, todosLosCromos);
                  console.log ('cromos que NO tengo');
                  console.log (this.cromosQueNoTengo);
                  this.PreparaImagenesCromosQueTengo();
                  this.PreparaImagenesCromosQueFaltan();      
                  this.preparado = true;
                });
            });
        });
  }


  PreparaImagenesCromosQueTengo() {
    for (let i = 0; i < this.cromosSinRepetidos.length; i++) {
      const elem = this.cromosSinRepetidos[i];
      this.cromosQueTengoImagenDelante[i] = URL.ImagenesCromo + elem.cromo.ImagenDelante;
      if (this.coleccion.DosCaras) {
        this.cromosQueTengoImagenDetras[i] = URL.ImagenesCromo + elem.cromo.ImagenDetras;
      }
    }
  }

  PreparaImagenesCromosQueFaltan() {
    console.log ('cromos que NO tengo');
    console.log (this.cromosQueNoTengo);
    for (let j = 0; j < this.cromosQueNoTengo.length; j++) {
      const elem = this.cromosQueNoTengo[j];
      this.cromosQueNoTengoImagenDelante[j] = URL.ImagenesCromo + elem.cromo.ImagenDelante;

    }
    console.log ('IMAGENES cromos que NO tengo');
    console.log (this.cromosQueNoTengoImagenDelante);

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

  
  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }
}

