import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
import { Alumno } from '../clases';
import { SesionService} from '../servicios/sesion.service';
import { PeticionesAPIService} from '../servicios/index';
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
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService)  {}

    Autentificar() {
      this.peticionesAPI.DameAlumno(this.nombre, this.apellido).subscribe(
        (res) => {
          if (res[0] !== undefined) {
            this.alumno = res[0]; // Si es diferente de null, el profesor existe y lo meto dentro de profesor
            // Envio el profesor a la sesión
            this.sesion.TomaAlumno(this.alumno);
            console.log('bien logado');
            // En principio, no seria necesario enviar el id del profesor porque ya
            // tengo el profesor en la sesión y puedo recuperarlo cuando quiera.
            // Pero si quitamos el id hay que cambiar las rutas en app-routing
            // De momento lo dejamos asi.
            // this.route.navigateByUrl ('/inicio/' + this.profesor.id);
          } else {
            // Aqui habría que mostrar alguna alerta al usuario
            console.log('profe no existe');
          }
        }
      );
    }

}
