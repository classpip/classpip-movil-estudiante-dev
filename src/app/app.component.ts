import { Component} from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { HomePage } from '../app/home/home.page';
import { Alumno } from '../app/clases/Alumno';
import { SesionService } from '../app/servicios/sesion.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  MiAlumno: Alumno;
  constructor(
    private sesion: SesionService,
    private route: Router,
    public navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('cuando se lee esto??');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.MiAlumno = this.sesion.DameAlumno();
    });
  }

  GoHome() {
    this.route.navigateByUrl('/home');
  }

  GoMiPerfil() {
    this.route.navigateByUrl('mi-perfil');
  }

  GoGrupos() {
    this.route.navigateByUrl('mis-grupos');
  }

  GoJuegosActivos() {
    this.route.navigateByUrl('inici');
  }
}
