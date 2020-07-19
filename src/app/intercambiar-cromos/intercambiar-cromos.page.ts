import { Component, OnInit } from '@angular/core';
import { SesionService} from '../servicios/sesion.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { Http, ResponseContentType} from '@angular/http';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {  Juego, Equipo, Alumno, Cromo} from '../clases/index';
import { Router } from '@angular/router';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import * as URL from '../URLs/urls';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intercambiar-cromos',
  templateUrl: './intercambiar-cromos.page.html',
  styleUrls: ['./intercambiar-cromos.page.scss'],
})
export class IntercambiarCromosPage implements OnInit {

  cromoSeleccionado: any;
  alumnoSelecciondo: any[];
  juegoSeleccionado: Juego;
  alumnosJuegoDeColeccion: Alumno[] = [];
  MisCromosSinRepetidos: any[];
  imagenCromo: string;
  alumno: Alumno;
  cromo: Cromo;


  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private http: HttpClient, private https: Http,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private route: Router,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.alumno = this.sesion.DameAlumno();
    this.cromo = this.sesion.DameCromo();
    this.imagenCromo = URL.ImagenesCromo + this.cromo.ImagenDelante;
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.peticionesAPI.DameAlumnosJuegoDeColeccion(this.juegoSeleccionado.id)
      .subscribe (alumnos => {
            this.alumnosJuegoDeColeccion = alumnos;
            // quito de la lista al alumno que hace el regalo
            this.alumnosJuegoDeColeccion = this.alumnosJuegoDeColeccion.filter (alumno => alumno.id !== this.alumno.id);
      });
    } else {
      // recuperar los equipos del juego
    }

  }

  onChange(value) {
    console.log(value);
    this.alumnoSelecciondo = value.split(' ');
    console.log(this.alumnoSelecciondo);
  }


  AsignarCromo() {
    if (this.alumnoSelecciondo === undefined) {
      Swal.fire('Selecciona primero el compañero al que le regalas el cromo', ' ', 'error');
    }

    if (this.alumnoSelecciondo !== undefined) {
      console.log ('voy a asingar a ');
      console.log (this.alumnoSelecciondo);
      this.calculos.AsignaCromo(this.cromo, this.alumnoSelecciondo, this.alumno, this.juegoSeleccionado);
      Swal.fire('Cromo regalado con éxito', ' ', 'success');
      this.route.navigateByUrl('/juego-colleccion');
    }

  }

}
