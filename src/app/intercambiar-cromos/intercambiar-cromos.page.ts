import { Component, OnInit } from '@angular/core';
import { SesionService} from '../servicios/sesion.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { Http, ResponseContentType} from '@angular/http';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {  Juego, Equipo, Alumno, Cromo} from '../clases/index';
@Component({
  selector: 'app-intercambiar-cromos',
  templateUrl: './intercambiar-cromos.page.html',
  styleUrls: ['./intercambiar-cromos.page.scss'],
})
export class IntercambiarCromosPage implements OnInit {

  cromoSeleccionado: any;
  alumnoSelecciondo: any;
  juegoSeleccionado: Juego;
  MisAlumnosJuegoColeccion: Alumno[] = [];
  MisCromosSinRepetidos: any[];
  imagenCromo: string;
  public cromo: Cromo;
  public alumno: any;
  studentsSelectedArray: Array<any> = new Array<any>();
  MiAlumno: Alumno;

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private http: HttpClient, private https: Http,
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
        });
    });
    console.log(this.MisCromosSinRepetidos);
  }

  ionChange() {
    console.log(this.cromoSeleccionado);
    this.DameImagenCromo();
    console.log(this.cromo);
  }
  ionChangeAlumno() {
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

  AsignarCromo() {
    this.calculos.AsignaCromo(this.cromo, this.alumnoSelecciondo, this.MiAlumno);
  }

}
