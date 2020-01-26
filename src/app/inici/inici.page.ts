import { Component, OnInit } from '@angular/core';
import { SesionService} from '../servicios/sesion.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { Juego, Equipo } from '../clases/index';
import { Router } from '@angular/router';
import { JuegoSeleccionadoPage } from '../juego-seleccionado/juego-seleccionado.page';

@Component({
  selector: 'app-inici',
  templateUrl: './inici.page.html',
  styleUrls: ['./inici.page.scss'],
})
export class IniciPage implements OnInit {

  id: number;
  JuegosActivos: Juego[] = [];
  JuegosInactivos: Juego[] = [];

  constructor(
    private route: Router,
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.id = this.sesion.DameAlumno().id;
    console.log('Este es el id del alumno que se ha logado: ' + this.id);
    this.calculos.DameJuegosAlumno(this.id)
    .subscribe ( listas => {
            this.JuegosActivos = listas.activos;
            console.log('Muestro los Juegos pero luego me da que el length es 0??????');
            console.log(this.JuegosActivos);
            console.log(this.JuegosActivos.length);
            // Si la lista aun esta vacia la dejo como indefinida para que me
            // salga el mensaje de que aun no hay juegos

    });
    console.log ('Ya he traido los juegos');
  }

  JuegoSeleccionado(juego: any) {
    this.sesion.TomaJuego(juego);
    this.navCtrl.navigateForward('/juego-seleccionado');
    // this.navCtrl.push (JuegoSeleccionadoPage,{juego:juego});
  }


}
