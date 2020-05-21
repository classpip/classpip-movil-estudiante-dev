import { Component, OnInit, ViewChild} from '@angular/core';
import { SesionService} from '../servicios/sesion.service';
import { NavController, LoadingController, AlertController} from '@ionic/angular';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {  Juego, Equipo, Alumno, MiAlumnoAMostrarJuegoDePuntos, Grupo, MiEquipoAMostrarJuegoDePuntos} from '../clases/index';
import { IonContent } from '@ionic/angular';
import { MiAlumnoAMostrarJuegoDeCuestionario } from '../clases/MiAlumnoAMostrarJuegoDeCuestionario';
@Component({
  selector: 'app-juego-seleccionado',
  templateUrl: './juego-seleccionado.page.html',
  styleUrls: ['./juego-seleccionado.page.scss'],
})
export class JuegoSeleccionadoPage implements OnInit {


  juegoSeleccionado: Juego;
  MisAlumnosAMostrar: MiAlumnoAMostrarJuegoDePuntos[] = [];
  MisEquiposJuegoPuntosAMostrar: MiEquipoAMostrarJuegoDePuntos[] = [];
  MisAlumnosJuegoColeccion: Alumno[] = [];
  MisEquiposJuegoColecciones: Equipo[] = [];
  MiAlumno: Alumno;
  NuestroHistorialPuntos: any [] = [];
  Grupo: Grupo;
  muestralo: boolean = false;


  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.MiAlumno = this.sesion.DameAlumno();
    this.NuestroHistorialPuntos = this.calculos.DameHistorialPuntosMiEquipo(this.MiAlumno.id, this.juegoSeleccionado.id);
    console.log(this.juegoSeleccionado);
    this.peticionesAPI.DameGrupo(this.juegoSeleccionado.grupoId).subscribe(
      MiGrupo => {
        this.sesion.TomaGrupo(MiGrupo);
        this.Grupo = MiGrupo;
        console.log('NO ENTRA AQUI???');
      }
    );

    console.log( 'Este es el grupo' + this.Grupo );
    if ( this.juegoSeleccionado.Tipo === 'Juego De Puntos' ) {
      if ( this.juegoSeleccionado.Modo === 'Individual') {
        this.MisAlumnosAMostrar = this.calculos.DameAlumnosJuegoPuntos(this.juegoSeleccionado.id);
        console.log('ya he traido los alumnos con los puntos');
        this.MisAlumnosAMostrar = this.OrdenarPorPuntos();
        console.log(this.MisAlumnosAMostrar);
      } else {
        this.MisEquiposJuegoPuntosAMostrar = this.calculos.DameEquiposJuegoPuntos(this.juegoSeleccionado.id);
        console.log('ya he traido los equipos');
        console.log(this.MisEquiposJuegoPuntosAMostrar);
      }
    } else if (this.juegoSeleccionado.Tipo === 'Juego De Colección'){
      if ( this.juegoSeleccionado.Modo === 'Individual') {
        this.MisAlumnosJuegoColeccion = this.calculos.DameAlumnosJuegoDeColecciones(this.juegoSeleccionado.id);
        console.log('Estos son los alumnos del Juego de Col');
        console.log(this.MisAlumnosJuegoColeccion);
      } else {
        this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id).subscribe(
          listaEquipos => {
            this.MisEquiposJuegoColecciones = listaEquipos;
            console.log('hola');
            console.log(this.MisEquiposJuegoColecciones);
          });
      }
    } 
  }

  // Se llama a la funcion al clicar sobre el sobre del equipo
  VerCromosEquipo(equipo: any) {
    console.log ('Voy a buscar los cromos del Equipo');
    this.sesion.TomaEquipo(equipo);
    this.navCtrl.navigateForward('/cromos-amostrar');
  }
  // Se llama a la funcion al clicar sobre el sobre del alumno
  VerCromosAlumno(alumno: any) {
    this.sesion.TomaAlumnoJuegoDeColeccion(alumno);
    this.navCtrl.navigateForward('/cromos-amostrar');
  }

  VerMisPuntos() {
    this.navCtrl.navigateForward('/mis-puntos');
  }

  VerInformacion() {
    this.navCtrl.navigateForward('/informacion');
  }

  IrIntercambiarCromos() {
    this.navCtrl.navigateForward('/intercambiar-cromos');
  }

  OrdenarPorPuntos() {
    // tslint:disable-next-line:only-arrow-functions
    this.MisAlumnosAMostrar = this.MisAlumnosAMostrar.sort(function(obj1, obj2) {
      return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
    });
    return this.MisAlumnosAMostrar;
  }

  VerRanking() {
    this.muestralo = true;
  }
}
