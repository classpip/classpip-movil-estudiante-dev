import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService } from '../servicios/sesion.service';
import { NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {
  Juego, Equipo, Alumno, MiAlumnoAMostrarJuegoDePuntos, Grupo,
  MiEquipoAMostrarJuegoDePuntos, Cromo, Coleccion
} from '../clases/index';
import Swal from 'sweetalert2';


import * as URL from '../URLs/urls';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-juego-colleccion',
  templateUrl: './juego-colleccion.page.html',
  styleUrls: ['./juego-colleccion.page.scss'],
})
export class JuegoColleccionPage implements OnInit {

  juegoSeleccionado: Juego;
  // MisAlumnosAMostrar: MiAlumnoAMostrarJuegoDePuntos[] = [];
  // MisEquiposJuegoPuntosAMostrar: MiEquipoAMostrarJuegoDePuntos[] = [];



  //De mi Alumno conectado
  // MiAlumno: Alumno;
  // MiEquipo: Equipo;
  // alumnosMiEquipo: Alumno[];
  // Grupo: Grupo;
  // AlumnoMisImagenesCromoDelante: string[] = [];
  // AlumnoMisImagenesCromoDetras: string[] = [];
  // AlumnoMisCromos: Cromo[] = [];
  // AlumnolistaCromosSinRepetidos: any[];
  // AlumnoCromosQueNoTengo: any[] = [];



  cromosQueTengoImagenDelante: string[] = [];
  cromosQueTengoImagenDetras: string[] = [];
  cromosQueNoTengoImagenDelante: string[] = [];
  cromosQueTengo: any[] = [];
  cromosQueNoTengo: any[] = [];
  cromosSinRepetidos: any[];
  alumno: Alumno;
  equipo: Equipo;
  alumnosJuegoDeColeccion: Alumno[] = [];
  equiposJuegoDeColeccion: Equipo[] = [];



  //Cromos
  // Miequipo: Equipo;
  // Mialumno: Alumno;
  // alumnosEquipo: Alumno[];
  // MisImagenesCromo: string[] = [];
  // MisCromos: Cromo[] = [];
  // listaCromosSinRepetidos: any[];
  // CromosQueNoTengo: any[];
  // CromosQueNoTengoDelante: any[] = [];
  // CromosQueNoTengoDetras: any[] = [];
  // ImagenesCromosQueNoTengoDelante: string[] = [];
  // ImagenesCromosQueNoTengoDetras: string[] = [];


  //Mostrar ranking
 // public hideMe: boolean = false;
  //Mostrar cromos alumno/equipo
 // infoView: boolean = false;
  sliderConfig: any;
  coleccion: Coleccion;

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  @ViewChild('content', { static: false }) content: IonContent;

  ngOnInit() {
    this.sliderConfig = {
      slidesPerView: 1.6,
      spaceBetween: 10,
      centeredSlides: true
    };
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameColeccion(this.juegoSeleccionado.coleccionId)
    .subscribe (coleccion => this.coleccion = coleccion);
    this.alumno = this.sesion.DameAlumno();
    this.equipo = this.sesion.DameEquipo();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.DameLosCromosDelAlumno();
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
  MostrarAlbum() {
    this.sesion.TomaColeccion (this.coleccion);
    this.sesion.TomaCromos (this.cromosQueTengo);
    this.navCtrl.navigateForward('/album-alumno');
  }
  RegalarCromo(elem, i) { // elem tiene el cromo y el número de repeticiones, 
    // i es la posición en el vector de cromos, para facilitar su eliminación
    console.log ('voy a regalar el cromo');
    console.log (elem);
    if (elem.rep === 1) {
      // Advierto de que si lo regala se va a quedar sin ese cromo
      Swal.fire({
        title: '¿seguro que quieres regalar este cromo?',
        text: 'No lo tienes repetido. Te vas a quedar si él.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirma'
      }).then((result) => {
        if (result.value) {
          // actualizo las lista de cromos y de imágenes
          // ATENCIÓN: ME VA BIEN ACTUALIZAR LAS LISTAS AHORA.
          // PERO SI EL REGALO DEL CROMO FINALMENTE FRACASA (POR LO QUE SEA) TENEMOS UN
          // PROBLEMA PORQUE HE HECHO YA LOS CAMBIOS COMO SE EL REGALO SE HACE.
          this.cromosSinRepetidos = this.cromosSinRepetidos.filter (e => e.cromo.id !== elem.cromo.id);
          this.cromosQueTengoImagenDelante.splice (i , 1);
          if (this.coleccion.DosCaras) {
            this.cromosQueTengoImagenDetras.splice (i, i);
          }
          elem.rep = 0; // me quedo sin copias de ese cromo
          this.cromosQueNoTengo.push (elem);
          this.cromosQueTengoImagenDelante.push ( URL.ImagenesCromo + elem.cromo.ImagenDelante);
          if (this.coleccion.DosCaras)  {
            this.cromosQueTengoImagenDelante.push ( URL.ImagenesCromo + elem.cromo.ImagenDetras);
          }
          this.cromosQueTengo = this.cromosQueTengo.filter (c => c.id !== elem.cromo.id);
          this.sesion.TomaCromo (elem.cromo);
          this.sesion.TomaAlumno (this.alumno);
          this.navCtrl.navigateForward('intercambiar-cromos');
        }
      });
    } else {
      Swal.fire({
        title: '¿seguro que quieres regalar este cromo?',
        text: 'Tienes ' + elem.rep + ' copias de este cromo.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirma'
      }).then((result) => {
        if (result.value) {
          // tomo nota de que tengo una copia menos de ese cromo
          this.cromosSinRepetidos.filter (e => e.cromo.id === elem.cromo.id)[0].rep--;
          this.sesion.TomaCromo (elem.cromo);
          this.navCtrl.navigateForward('intercambiar-cromos');
        }
      });

    }
  }

  // DameEquipoAlumnoConectado() {
  //   // tslint:disable-next-line:prefer-for-of
  //   for ( let i = 0; i < this.MisEquiposJuegoColecciones.length; i++){
  //     this.peticionesAPI.DameAlumnosEquipo(this.MisEquiposJuegoColecciones[i].id)
  //     .subscribe(res => {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let j = 0; j < res.length; j++) {
  //         if (res[j].Nombre === this.MiAlumno.Nombre) {
  //           this.alumnosMiEquipo = res;
  //           console.log(res);
  //           this.MiEquipo = this.MisEquiposJuegoColecciones[i];
  //           console.log('tu equipo');
  //           console.log(this.MiEquipo);
  //         } else {
  //           console.log('No hay alumnos en este equipo');
  //           this.alumnosMiEquipo = undefined;
  //         }
  //       }
  //     });
  //   }
  // }

  // Traigo los cromos del alumno

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
                });
            });
        });
  }

  // // Obtenemos los cromos de los demás en el ranking
  // DameCromosDelAlumno(alumno: any) {
  //   this.toggleInfoView();
  //   this.sesion.TomaAlumnoJuegoDeColeccion(alumno);
  //   if (this.juegoSeleccionado.Modo === 'Individual') {
  //     this.Mialumno = this.sesion.DameAlumnoJuegoDeColeccion();
  //     this.peticionesAPI.DameInscripcionAlumnoJuegoDeColeccion(this.juegoSeleccionado.id, this.Mialumno.id).subscribe(
  //       InscripcionAlumno => {
  //         this.peticionesAPI.DameCromosAlumno(InscripcionAlumno[0].id).subscribe(
  //           Cromos => {
  //             console.log(Cromos);
  //             this.MisCromos = Cromos;
  //             this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
  //             console.log(this.listaCromosSinRepetidos);
  //             this.sesion.TomaCromosSinRepetidos(this.listaCromosSinRepetidos);
  //             this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
  //               TodosLosCromos => {
  //                 console.log('aqui estan todos los cromos');
  //                 console.log(TodosLosCromos);
  //                 this.CromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.MisCromos, TodosLosCromos);
  //               });
  //             console.log('Cromos que no tengo:');
  //             console.log(this.CromosQueNoTengoDelante);
  //             this.DameImagenesCromos();
  //           });
  //       });
  //     // this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
  //     console.log(this.MisCromos);
  //     console.log(this.listaCromosSinRepetidos);
  //     // this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

  //     // this.MisImagenesCromo = this.calculos.VisualizarCromosDelAlumno(this.MisCromos);
  //   } else {
  //     console.log('Voy a buscar los cromos del Equipo');
  //     this.sesion.TomaEquipo(alumno);
  //     this.Miequipo = this.sesion.DameEquipo();
  //     this.AlumnosDelEquipo(this.Miequipo);
  //     this.peticionesAPI.DameInscripcionEquipoJuegoDeColeccion(this.juegoSeleccionado.id, this.Miequipo.id).subscribe(
  //       InscripcionEquipo => {
  //         this.peticionesAPI.DameCromosEquipo(InscripcionEquipo[0].id).subscribe(
  //           Cromos => {
  //             console.log(Cromos);
  //             this.MisCromos = Cromos;
  //             this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
  //             console.log(this.listaCromosSinRepetidos);
  //             this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
  //               TodosLosCromos => {
  //                 this.CromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.MisCromos, TodosLosCromos);
  //               });
  //             this.DameImagenesCromos();
  //           });
  //       });
  //     console.log(this.MisImagenesCromo);
  //   }
  // }

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

  // DameImagenesCromos() {
  //   console.log('voy a por las imagenes de cada cromo');
  //   for (let i = 0; i < this.listaCromosSinRepetidos.length; i++){
  //     const elem = this.listaCromosSinRepetidos[i];
  //     console.log('quiero la imagen de este: ' + elem)
  //     if(elem.cromo.ImagenDelante !== undefined) {
  //       this.MisImagenesCromo[i] = URL.ImagenesCromo + elem.cromo.ImagenDelante;
  //     }
  //   }
  // }

  // intercambiar Cromo
  // intercambiarCromo() {
  //   this.navCtrl.navigateForward('intercambiar-cromos')
  // }
  
  // Alumnos de cada equipo
  // AlumnosDelEquipo(equipo: Equipo) {
  //   console.log(equipo);

  //   this.peticionesAPI.DameAlumnosEquipo(equipo.id)
  //     .subscribe(res => {
  //       if (res[0] !== undefined) {
  //         this.alumnosEquipo = res;
  //         console.log(res);
  //       } else {
  //         console.log('No hay alumnos en este equipo');
  //         this.alumnosEquipo = undefined;
  //       }
  //     });
  // }

  // // Mostrar Ranking y scroll up/down de la pantalla
  // MuestraElRanking() {
  //   this.hideMe = true;
  //   this.scrollToBottom();
  //   console.log(this.hideMe)
  // }
  // OcultarElRanking() {
  //   this.scrollToTop();
  //   this.hideMe = false;
  //   console.log(this.hideMe)
  // }
  // scrollToBottom(): void {
  //   this.content.scrollToBottom(300);
  // }
  // scrollToTop() {
  //   this.content.scrollToTop();
  // }

  // configuramos el slider de los cromos
 
  // y el botón para mostrarlos
  // toggleInfoView() {
  //   this.infoView = !this.infoView;
  // }
  // cierraOtrosAlbumes() {
  //   if (this.infoView == true) {
  //     this.infoView = false;
  //   }
  // }
  
  /* Nuevo método para obtener las imagenes */
  
}

