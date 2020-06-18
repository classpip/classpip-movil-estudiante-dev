import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
import { Alumno } from '../clases';
import { IniciPage } from '../inici/inici.page';
import { TabsPage } from '../tabs/tabs.page';
import { PeticionesAPIService, SesionService} from '../servicios/index';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  alumno: Alumno;
  nombre: string;
  apellido: string;



  constructor(
    // private http: HttpClient,
    private route: Router,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    public loadingController: LoadingController,
    public alertController: AlertController)  {}

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
