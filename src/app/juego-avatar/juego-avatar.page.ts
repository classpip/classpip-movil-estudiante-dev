import { Component, OnInit, ViewChild } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { NavController, IonContent } from '@ionic/angular';
import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar } from '../clases/index';

@Component({
  selector: 'app-juego-avatar',
  templateUrl: './juego-avatar.page.html',
  styleUrls: ['./juego-avatar.page.scss'],
})
export class JuegoAvatarPage implements OnInit {

  MiAlumno: Alumno;
  InfoMiAlumno: AlumnoJuegoDeAvatar;
  juegoSeleccionado: JuegoDeAvatar;
  alumnosDelJuego: Alumno[];
  inscripcionesAlumnosJuegodeAvatar: AlumnoJuegoDeAvatar[];
  criterios: Array<{nombre: string, criterio: string}>;
  
  constructor(
    private calculos: CalculosService,
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    console.log ('Ya tengo el juego');
    console.log (this.juegoSeleccionado);
    this.MiAlumno = this.sesion.DameAlumno();
    console.log ('Ya tengo al alumno conectado');
    console.log (this.MiAlumno);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
     } else {
       //this.EquiposDelJuego();
     }
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    console.log ('Vamos a pos los alumnos');
    this.peticionesAPI.DameAlumnosJuegoDeAvatar(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos');
      console.log(alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      // Cuando tengo los alumnos recupero las inscripciones
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnosJuegodeAvatar = inscripciones;
      // Ahora preparo la tabla que se va a mostrar
      console.log('toma las inscripciones');
      console.log(inscripciones);
      this.DameInfoAlumnoConectado();
    });
  }

  DameInfoAlumnoConectado() {
    console.log('voy a por mi alumno conectado');
    for (let i = 0; i < this.inscripcionesAlumnosJuegodeAvatar.length; i++){
      console.log('pruebo con');
      console.log(this.inscripcionesAlumnosJuegodeAvatar[i]);
      if(this.inscripcionesAlumnosJuegodeAvatar[i].alumnoId === this.MiAlumno.id) {
        this.InfoMiAlumno = this.inscripcionesAlumnosJuegodeAvatar[i];
      }
    }
    console.log('ya tengo los requisitos');
    console.log(this.InfoMiAlumno);
    this.SeparaLosCriterios();
  }

  SeparaLosCriterios() {
    this.criterios = [
      {nombre: 'Complemento 1', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento1},
      {nombre: 'Complemento 2', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento2},
      {nombre: 'Complemento 3', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento3},
      {nombre: 'Complemento 4', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento4},
      {nombre: 'Espíar Compañeros', criterio: this.juegoSeleccionado.CriteriosPrivilegioVerTodos},
      {nombre: 'Nota de Voz', criterio: this.juegoSeleccionado.CriteriosPrivilegioVoz}
    ]
    console.log('aqui estan los criterios');
    console.log(this.criterios);
  }
  AbreEditorAvatar() {
    this.sesion.TomaPrivilegiosAlumno(this.InfoMiAlumno.Privilegios);
    this.navCtrl.navigateForward('/avatar-editor');
  }
}
