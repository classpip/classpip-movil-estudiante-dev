import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
import { Alumno } from '../clases';
import { IniciPage } from '../inici/inici.page';
import { TabsPage } from '../tabs/tabs.page';
import { PeticionesAPIService, SesionService} from '../servicios/index';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import Swal from 'sweetalert2';import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  alumno: Alumno;
  nombre: string;
  apellido: string;

  coords: any = { lat: 0, lng: 0 };

  constructor(
    // private http: HttpClient,
    private route: Router,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    
    private geolocation: Geolocation
    )  {}


    
obtenerPosicion(): any{
  console.log('entro en la funcion');
  this.geolocation.getCurrentPosition().then(res => {
    this.coords.lat = res.coords.latitude;
    this.coords.lng = res.coords.longitude;
    console.log(this.coords.lat);
    console.log(this.coords.lng);
    Swal.fire('Coordenadas ' + this.coords.lat + ', ' +  this.coords.lng);

  })
  .catch(
    (error) => {
      console.log(error);
    }
  );
}

    async presentLoading() {
      const loading = await this.loadingController.create({
        message: 'Verificando Usuario',
        duration: 1500
      });
      await loading.present();

      const { role, data } = await loading.onDidDismiss();

      console.log('Loading dismissed!');
    }

    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'Error',
        // subHeader: 'Subtitle',
        message: 'Usuario y/o contraseña incorrectos',
        buttons: ['OK']
      });

      await alert.present();
    }

    Autentificar() {


      this.presentLoading();
      this.peticionesAPI.DameAlumno(this.nombre, this.apellido).subscribe(
        (res) => {
          if (res[0] !== undefined) {
            this.alumno = res[0];
            this.sesion.TomaAlumno(this.alumno);
            console.log('bien logado');
            setTimeout(() => {
              this.route.navigateByUrl('/tabs/inici');
            }, 1500);
          } else {
            // Aqui habría que mostrar alguna alerta al usuario
            setTimeout(() => {
              this.presentAlert();
            }, 1500);
            console.log('alumno no existe');
          }
        }
      );
    }

}
