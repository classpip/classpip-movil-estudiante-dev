import { Component, OnInit} from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Alumno } from '../app/clases/Alumno';
import { SesionService, ComServerService } from '../app/servicios';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  MiAlumno: Alumno;
  navigate : any;
  constructor(
    private sesion: SesionService,
    private comServer: ComServerService,
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
      this.sesion.EnviameAlumno().subscribe ((alumno) => this.MiAlumno = alumno
      );
    });
  }

  GoOut() {
    this.comServer.Desconectar(this.MiAlumno);
    this.route.navigateByUrl('/home');
  }

  GoMiPerfil() {
    this.route.navigateByUrl('tabs/mi-perfil');
  }

  GoMisGrupos() {
    this.MiAlumno = this.sesion.DameAlumno();
    console.log ('Estamos');
    console.log (this.MiAlumno);
    this.route.navigateByUrl('tabs/mis-grupos');
  }

  GoMisJuegos() {
    this.route.navigateByUrl('tabs/inici');
  }
  
/*   GoJuegosInactivos() {
    this.route.navigateByUrl('juegos-inactivos');
  } */
}