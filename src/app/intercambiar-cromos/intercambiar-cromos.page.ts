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
import { ModalController } from '@ionic/angular';

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
    public modalCtrl: ModalController,
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

  async RegalarCromo() {
    const misInputs: any [] = [];
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
    const alert = await this.alertController.create({
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
            // Cierro el diálogo indicando que no se ha ejecutado el regalo
            this.modalCtrl.dismiss({
              regalado: false
            });
          }
        }, {
          text: 'Ok',
          handler: async (destinatarioId) => {
            // recibo el id del alumno destinatorio del cromo
            this.calculos.RegalaCromo(this.cromo, destinatarioId, this.alumno, this.juegoSeleccionado);
            const alert2 = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: 'Cromo regalado con éxito',
                buttons: ['OK']
            });
            await alert2.present();
            // cierro el diálogo indicando que si se ha efectuado el regalo
            this.modalCtrl.dismiss({
              regalado: true
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
