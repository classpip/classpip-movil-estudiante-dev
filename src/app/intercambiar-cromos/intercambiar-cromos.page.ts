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
@Component({
  selector: 'app-intercambiar-cromos',
  templateUrl: './intercambiar-cromos.page.html',
  styleUrls: ['./intercambiar-cromos.page.scss'],
})
export class IntercambiarCromosPage implements OnInit {

  cromoSeleccionado: any;
  alumnoSelecciondo: any[];
  juegoSeleccionado: Juego;
  MisAlumnosJuegoColeccion: Alumno[] = [];
  MisCromosSinRepetidos: any[];
  imagenCromo: string;
  public cromo: any;
  public alumno: any;
  studentsSelectedArray: Array<any> = new Array<any>();
  MiAlumno: Alumno;
  OK: any[];
  i: number;
  final: number;
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
    this.MisAlumnosJuegoColeccion = this.calculos.DameAlumnosJuegoDeColecciones(this.juegoSeleccionado.id);
    console.log(this.MisAlumnosJuegoColeccion);
    this.MiAlumno = this.sesion.DameAlumno();
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeColeccion(this.juegoSeleccionado.id, this.MiAlumno.id).subscribe(
        InscripcionAlumno => {
          this.peticionesAPI.DameCromosAlumno(InscripcionAlumno[0].id).subscribe(
            Cromos => {
              console.log(Cromos);
              this.MisCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(Cromos);
              this.i = 0;
              // VAMOS A QUITAR DE LOS ALUMNOS A MOSTRAR, EL PROPIO ALUMNO QUE SE HA LOGADO
              this.MisAlumnosJuegoColeccion.forEach(alum => {
              if (alum.id === this.MiAlumno.id) {
                this.final = this.i;
                console.log(this.final);
              }
              this.i++;
              console.log(this.i);
              });
              this.MisAlumnosJuegoColeccion.splice(this.final, 1);
              console.log(this.MisAlumnosJuegoColeccion);
        });
    });
    console.log(this.MisCromosSinRepetidos);
  }

  ionChange() {
    console.log(this.cromoSeleccionado);
    this.DameImagenCromo();
    console.log(this.cromo);
  }
  onChange(value) {
    console.log(value);
    this.alumnoSelecciondo = value.split(' ');
    console.log(this.alumnoSelecciondo);
  }

  public DameImagenCromo() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.MisCromosSinRepetidos.length; i++) {
      if (this.cromoSeleccionado === this.MisCromosSinRepetidos[i].cromo.Nombre) {
        this.cromo = this.MisCromosSinRepetidos[i].cromo;
      }
    }
    if (this.cromo.Imagen !== undefined) {
      this.https.get( 'http://localhost:3000/api/imagenes/ImagenCromo/download/' + this.cromo.Imagen,
      { responseType: ResponseContentType.Blob }).subscribe(
          response => {
              const blob = new Blob([response.blob()], { type: 'image/jpg'});
              const reader = new FileReader();
              reader.addEventListener('load', () => {
              this.imagenCromo = reader.result.toString();
            }, false);
              if (blob) {
                    reader.readAsDataURL(blob);
                  }
              });
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Asignando Cromo',
      duration: 1500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'HECHO!',
      // subHeader: 'Subtitle',
      message: 'Se ha asignado el cromo correctamente',
      buttons: ['OK']
    });
    setTimeout(() => {
      this.route.navigateByUrl('/juego-seleccionado');
    }, 1500);

    await alert.present();
  }

  async presentAlert2() {
    const alert = await this.alertController.create({
      header: 'ERROR!',
      // subHeader: 'Subtitle',
      message: 'Primero selecciona el alumno',
      buttons: ['OK']
    });
    setTimeout(() => {
    }, 1500);

    await alert.present();
  }
  async presentAlert3() {
    const alert = await this.alertController.create({
      header: 'ERROR!',
      // subHeader: 'Subtitle',
      message: 'Primero selecciona el cromo',
      buttons: ['OK']
    });
    setTimeout(() => {
    }, 1500);

    await alert.present();
  }

  AsignarCromo() {
    console.log(this.alumnoSelecciondo);
    this.presentLoading();
    if (this.cromoSeleccionado === undefined) {
      setTimeout(() => {
        this.presentAlert3();
      }, 1500);

    }
    if (this.alumnoSelecciondo === undefined) {
      setTimeout(() => {
        this.presentAlert2();
      }, 1500);
    }

    if (this.alumnoSelecciondo !== undefined && this.cromoSeleccionado !== undefined) {
      this.OK = this.calculos.AsignaCromo(this.cromo, this.alumnoSelecciondo, this.MiAlumno, this.juegoSeleccionado);
      console.log(this.OK);
      console.log('TODO BIEN');
      setTimeout(() => {
        this.presentAlert();
      }, 1500);
    }

  }

}
