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



  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    public modalController: ModalController
  ) { }

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
  preparado = false;

  disablePrevBtn = true;
  disableNextBtn = false;


  ElegirYRegalarCromo;


  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

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
    // this.peticionesAPI.DameColeccion(this.juegoSeleccionado.coleccionId)
    // .subscribe (coleccion => this.coleccion = coleccion);
    this.peticionesAPI.DameColeccionPromise(this.juegoSeleccionado.coleccionId)
    .then (coleccion => this.coleccion = coleccion);
    this.equipo = this.sesion.DameEquipo();
    console.log ('ya tengo equipo ', this.equipo);
    if (this.juegoSeleccionado.Modo === 'Individual') {

      this.DameLosCromosDelAlumno();

    } else {
      this.DameLosCromosDelEquipo ();

    }

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.peticionesAPI.DameAlumnosJuegoDeColeccion(this.juegoSeleccionado.id)
      .subscribe (alumnos => {
            this.alumnosJuegoDeColeccion = alumnos;
            // quito de la lista al alumno que hace el regalo
            this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
      });
    } else if ((this.juegoSeleccionado.Modo === 'Equipos') && (this.juegoSeleccionado.Asignacion === 'Equipo')) {
      this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id)
      .subscribe (equipos => {
            this.equiposJuegoDeColeccion = equipos;
            // quito de la lista al equipo que hace el regalo
            this.equiposJuegoDeColeccion = this.equiposJuegoDeColeccion.filter (equipo => equipo.id !== this.equipo.id);
      });
    } else {
      // se trata de un juego de equipo pero con asignación individual
      // recuperamos los alumnos del grupo
      this.peticionesAPI.DameAlumnosGrupo(this.juegoSeleccionado.grupoId)
      .subscribe (alumnos => {
            this.alumnosJuegoDeColeccion = alumnos;
            // quito de la lista al alumno que hace el regalo
            this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
      });

    }

    // Esto es un ejemplo de una Promise
    // Se trata de una función que hace cosas y debe retornar un resultado. Pero el resultado depende de cosas que hace la función
    // llamando a otras funciones asíncronas. 
    // Esto ocurre en otros muchos puntos de classpip, y en esos puntos lo hemos resuelto con el mecanismo de los observables. De acuerdo
    // con ese mecanismo, la función que genera el resultado se mete en un observable y cuando tiene el resultado lo emite con la operación
    // next(). El que consume el resultado se subscribe al observable indicando lo que desea hacer cada vez que el generador emita un
    // resultado. Eso lo hemos hecho, por ejemplo, en las funciones del servicio PeticionesAPI, que elaboran el resultado a partir de
    // peticiones asincronas a la base de datos.
    // El mismo mecanismo se usa también para recibir las notificaciones del server. La app del alumno se subscribe
    // a un observable que nos emite las notificaciones a medida que van llegando.
    // Una Promise es similar a un observable. También hay una función que genera un resultado que construye
    // usando métodos asíncronos y hay un consumidor que debe esperar a que el productor le emita el resultado.
    // La diferencia es que el generador solo va a generar un resultado mientras que un observable puede generar muchos 
    // resultados. Por eso, el consumidor se subscribe a un observable para ir recibiendo todos los resultados que se vayan emitiendo,
    // pero no se subscribe a una promise. Eso no tiene sentido. A la promise se le pide que avise cuando tenga el resultado y listo.
    // Algunas de las cosas que se han venido haciendo con observables pueden hacerse con promises. Por ejemplo, esas funciones del servicio
    // peticionesAPI que nos dan el resultado de una consulta a la base de datos. En PeticionesAPI hay dos versiones de la función DameColeccion.
    // Una usa el mecanismo de observables y la otra el de promise. En este componente se obtiene la colección con la versión que usa promise,
    // simplemente a modo de ejemplo.
    // Hay otras cosas que no pueden hacerse con promise y deben hacerse 
    // con obserables, como por ejemplo, la recepción de notificaciones desde el server.

    // La promise se declara con antelación. En este caso la función regunta a quién hay que regalar el cromo y realizar el regado.
    // Nos informa con un booleano si ha hecho el regalo o no (porque el usuario puede arrepentirse).
    this.ElegirYRegalarCromo = (cromo: Cromo) => {
      return new Promise<boolean>((resolve, reject) => {
        const misInputs: any [] = [];

        if (this.juegoSeleccionado.Modo === 'Individual') {
          // preparo las opciones para el radio selector
          this.alumnosJuegoDeColeccion.forEach (alumno => {
            const input = {
              type: 'radio',
              label: alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido,
              value: alumno.id,
              checked: false
            };
            misInputs.push (input);
          });
          misInputs[0].checked = true; // la primera opción está marcada por defecto
          this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Elige a quién quieres regalar el cromo',
            inputs : misInputs,
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Me arrepiento');
                  // El alumno se ha arrepentido. Resuelvo la promise retornando falso
                  resolve (false);
                }
              }, {
                text: 'Ok',
                handler: async (destinatarioId) => {
                  // recibo el id del alumno destinatorio del cromo
                  this.calculos.RegalaCromoAlumnos(cromo, destinatarioId, this.alumno.id, this.juegoSeleccionado);
                  const alert2 = await this.alertCtrl.create({
                      cssClass: 'my-custom-class',
                      header: 'Cromo regalado con éxito',
                      buttons: ['OK']
                  }).then (res => res.present());
                  // resuelvo indicando que si se ha hecho el regalo
                  resolve (true);
                }
              }
            ]
          }).then (res => res.present());

        } else if ((this.juegoSeleccionado.Modo === 'Equipos') && (this.juegoSeleccionado.Asignacion === 'Equipo')) {
          // preparo las opciones para el radio selector
          this.equiposJuegoDeColeccion.forEach (equipo => {
            const input = {
              type: 'radio',
              label: equipo.Nombre,
              value: equipo.id,
              checked: false
            };
            misInputs.push (input);
          });
          misInputs[0].checked = true; // la primera opción está marcada por defecto
          this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Elige a qué equipo quieres regalar el cromo',
            inputs : misInputs,
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Me arrepiento');
                  resolve (false);

                }
              }, {
                text: 'Ok',
                handler: async (destinatarioId) => {
                  // recibo el id del alumno destinatorio del cromo
                  this.calculos.RegalaCromoEquipos(cromo, destinatarioId, this.equipo.id, this.juegoSeleccionado);
                  this.alertCtrl.create({
                      cssClass: 'my-custom-class',
                      header: 'Cromo regalado con éxito',
                      buttons: ['OK']
                  }).then (res => res.present());
                  resolve (true);
                }
              }
            ]
          }).then (res => res.present());



        } else {
          // Juego en equipo pero con asignación individual
          // preparo las opciones para el radio selector
          this.alumnosJuegoDeColeccion.forEach (alumno => {
            const input = {
              type: 'radio',
              label: alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido,
              value: alumno.id,
              checked: false
            };
            misInputs.push (input);
          });
          misInputs[0].checked = true; // la primera opción está marcada por defecto
          this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Elige a quién quieres regalar el cromo',
            inputs : misInputs,
            buttons: [
                      {
                        text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                          console.log('Me arrepiento');
                          resolve (false);
                        }
                      }, {
                        text: 'Ok',
                        handler: async (destinatarioId) => {
                          // recibo el id del alumno destinatorio del cromo
                          this.calculos.RegalaCromoAlumnoEquipo(cromo, destinatarioId, this.alumno.id, this.juegoSeleccionado);
                          this.alertCtrl.create({
                              cssClass: 'my-custom-class',
                              header: 'Cromo regalado con éxito',
                              buttons: ['OK']
                          }).then (res => res.present());
                          resolve (true);
                        }
                      }
                    ]
          }).then (res => res.present());
        }

      });
    };


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
      this.alertCtrl.create({
        header: '¿Seguro que quieres regalar el cromo?',
        message: 'No lo tienes repetido. Te vas a quedar sin él',
        buttons: [
          {
            text: 'SI',
            handler: async () => {
              //aqui es donde hago la llamada a la promise y le indico lo que quiero hacer cuando 
              // se resuelva. El resultado que me emitirá es un booleano que indica si el regalo se ha hecho o no.

              this.ElegirYRegalarCromo(elem.cromo).then (regalado => {
                if (regalado) {
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
              });
            }
          }, {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              console.log('No regalo');
            }
          }
        ]
      }).then (res => res.present());
    } else {
      this.alertCtrl.create({
        header: '¿Seguro que quieres regalar el cromo?',
        message: 'Tienes ' + elem.rep + ' copias de este cromo.',
        buttons: [
          {
            text: 'SI',
            handler: async () => {
              this.ElegirYRegalarCromo(elem.cromo).then (regalado => {
                if (regalado) {
                  // como se ha regalado el cromo tomo nota de que tengo una copia menos de ese cromo
                  this.cromosSinRepetidos.filter (e => e.cromo.id === elem.cromo.id)[0].rep--;
                }
              })
            }
          }, {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              console.log('No regalo');
            }
          }
        ]
      }).then (res => res.present());


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

