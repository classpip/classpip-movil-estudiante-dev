import { Component, OnInit, ViewChild } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { NavController, IonContent } from '@ionic/angular';
import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar } from '../clases/index';

import * as URL from '../URLs/urls';
import { ModalController } from '@ionic/angular';
import {AvatarEditorPage} from '../avatar-editor/avatar-editor.page';
import { getTreeMultipleDefaultNodeDefsError } from '@angular/cdk/tree';

@Component({
  selector: 'app-juego-avatar',
  templateUrl: './juego-avatar.page.html',
  styleUrls: ['./juego-avatar.page.scss'],
})
export class JuegoAvatarPage implements OnInit {

  alumno: Alumno;
  InfoMiAlumno: AlumnoJuegoDeAvatar;
  juegoSeleccionado: JuegoDeAvatar;
  alumnosDelJuego: Alumno[];
  inscripcionesAlumnosJuegodeAvatar: AlumnoJuegoDeAvatar[];
  criterios: Array<{nombre: string, criterio: string}>;
  imagenSilueta: any;
  inscripcionAlumnoJuegoAvatar: AlumnoJuegoDeAvatar;
  tieneAvatar = false;
  interval;
  
  constructor(
    private calculos: CalculosService,
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    this.alumno = this.sesion.DameAlumno();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeAvatar (this.juegoSeleccionado.id, this.alumno.id)
      .subscribe (inscripcion => {
        this.inscripcionAlumnoJuegoAvatar = inscripcion[0];
        if (this.inscripcionAlumnoJuegoAvatar.Silueta !== undefined) {
          this.tieneAvatar = true;
          console.log ('tiene avatar');
          this.MostrarAvatar();
        }
        this.PrepararCriterios();
      });
     } else {
       // De momento no hay avatar de equipo
     }
  }

  // Recupera los alumnos que pertenecen al juego
  // AlumnosDelJuego() {
  //   console.log ('Vamos a pos los alumnos');
  //   this.peticionesAPI.DameAlumnosJuegoDeAvatar(this.juegoSeleccionado.id)
  //   .subscribe(alumnosJuego => {
  //     console.log ('Ya tengo los alumnos');
  //     console.log(alumnosJuego);
  //     this.alumnosDelJuego = alumnosJuego;
  //     // Cuando tengo los alumnos recupero las inscripciones
  //     this.RecuperarInscripcionesAlumnoJuego();
  //   });
  // }

  // RecuperarInscripcionesAlumnoJuego() {
  //   this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(this.juegoSeleccionado.id)
  //   .subscribe(inscripciones => {
  //     this.inscripcionesAlumnosJuegodeAvatar = inscripciones;
  //     // Ahora preparo la tabla que se va a mostrar
  //     console.log('toma las inscripciones');
  //     console.log(inscripciones);
  //     this.DameInfoAlumnoConectado();
  //   });
  // }

  // No entiendo por qué trae todas las inscripciones y luego va a por la del alumno
  // podría traer directamente la del alumno

  // DameInfoAlumnoConectado() {
  //   console.log('voy a por mi alumno conectado');
  //   for (let i = 0; i < this.inscripcionesAlumnosJuegodeAvatar.length; i++){
  //     console.log('pruebo con');
  //     console.log(this.inscripcionesAlumnosJuegodeAvatar[i]);
  //     if(this.inscripcionesAlumnosJuegodeAvatar[i].alumnoId === this.MiAlumno.id) {
  //       this.InfoMiAlumno = this.inscripcionesAlumnosJuegodeAvatar[i];
  //     }
  //   }
  //   console.log('ya tengo los requisitos');
  //   console.log(this.InfoMiAlumno);
  //   this.SeparaLosCriterios();
  // }

  PrepararCriterios() {
    this.criterios = [
      {nombre: 'Complemento 1', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento1},
      {nombre: 'Complemento 2', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento2},
      {nombre: 'Complemento 3', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento3},
      {nombre: 'Complemento 4', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento4},
      {nombre: 'Espíar Compañeros', criterio: this.juegoSeleccionado.CriteriosPrivilegioVerTodos},
      {nombre: 'Nota de Voz', criterio: this.juegoSeleccionado.CriteriosPrivilegioVoz}
    ]
  }
  async AbreEditorAvatar() {

    this.sesion.TomaInscripcionAlumno(this.inscripcionAlumnoJuegoAvatar);
    // abrimos la página del editor de forma modal porque interesa recoger el resultado 
    // para actualizar el avatar en esta página
    const modal = await this.modalController.create({
      component: AvatarEditorPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // En data me devuelve dos cosas: si ha habido cambio en el avatar y, 
    // en caso afirmativo, la inscripcion que contiene el avatar cambiado
    if (data.hayCambio) {
      if (this.tieneAvatar) {
    
        this.inscripcionAlumnoJuegoAvatar = data.inscripcion;
        // voy a eliminar los complementos que haya ahora en el avatar
        // pero primero guardo la silueta que no quiero perderla
        const silueta = document.getElementById ('silueta');
        const imagenAvatar = document.getElementById('imagenAvatar');
        // elimino todos los elementos que están en la imagen (incluida la silueta)
        while (imagenAvatar.firstChild) {
          imagenAvatar.removeChild(imagenAvatar.lastChild);
        }
        // y vuelvo a poner la silueta
        imagenAvatar.appendChild(silueta);
        // ahora voy a por los nuevos complementos
        this.MostrarAvatar();
      } else {
        this.tieneAvatar = true;
        this.MostrarAvatar();
      }


    //this.navCtrl.navigateForward('/avatar-editor');
    }
  }


  MostrarAvatar() {
      // Hay un problama para mostrar el avatar
      // resulta que la operación getElementById no funciona bien si el elemento
      // que quiero obtener tiene un *ngIf, porque de acuerdo con el ciclo de ejecición
      // de Angular, primero obtiene el elemento y luego mira el *ngIf para ver si lo
      // tiene que colocar o no, con lo cual, al obtener el elemento lo que obtiene es un null.
      // Para alterar ese ciclo de ejecición basta con poner el getElementById dentro de un timer.
      // Esto hace que cambie el orden en el que se hacen las cosas y el getElementById lo haga
      // despues de decidir el *ngIf.
      // El timer puede tener un tiempo de disparo de 0. Con eso basta.
      let imagenAvatar;

      this.interval = setInterval(() => {
        imagenAvatar = document.getElementById('imagenAvatar');
        this.imagenSilueta = URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Silueta;

        // Ahora traigo los complementos, si existen
        if (this.inscripcionAlumnoJuegoAvatar.Complemento1 !== undefined) {
          const imagen1 = this.CreaImagen (1, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento1);
          imagenAvatar.appendChild(imagen1);
        }
        if (this.inscripcionAlumnoJuegoAvatar.Complemento2 !== undefined) {
          const imagen2 = this.CreaImagen (2, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento2);
          imagenAvatar.appendChild(imagen2);
        }
        if (this.inscripcionAlumnoJuegoAvatar.Complemento3 !== undefined) {
          const imagen3 = this.CreaImagen (3, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento3);
          imagenAvatar.appendChild(imagen3);
        }

        if (this.inscripcionAlumnoJuegoAvatar.Complemento4 !== undefined) {
          const imagen4 = this.CreaImagen (4, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento4);
          imagenAvatar.appendChild(imagen4);
        }
        clearInterval(this.interval);

      }, 0);
  }

  CreaImagen(numeroComplemento: number, imagenString: string): any {
    const imagen = document.createElement('img');
    imagen.style.position = 'absolute';
    imagen.style.width = '300px'; imagen.style.height = '324px';
    // los complementos se apilan según el orden indicado por el numero de complemento.
    imagen.style.zIndex = numeroComplemento.toString();

    imagen.src =  imagenString;
    return imagen;
  }

}
