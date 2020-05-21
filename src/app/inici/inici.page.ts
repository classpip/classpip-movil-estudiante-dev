import { Component, OnInit } from '@angular/core';
import { SesionService } from '../servicios/sesion.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
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

  /* Creamos los array con los juegos activos e inactivos que solicitaremos a la API */
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
      .subscribe(listas => {
        this.JuegosActivos = listas.activos;
        this.JuegosInactivos = listas.inactivos;
        console.log('Muestro los Juegos pero luego me da que el length es 0??????');
        console.log(this.JuegosActivos);
        console.log(this.JuegosActivos.length);
        // Si la lista aun esta vacia la dejo como indefinida para que me
        // salga el mensaje de que aun no hay juegos
      });
    console.log('Ya he traido los juegos');
  }

  JuegoSeleccionado(juego: Juego) {
    this.sesion.TomaJuego(juego);
    
    if (juego.Tipo === 'Juego De Puntos') {
      this.navCtrl.navigateForward('/juego-puntos');
    } else if (juego.Tipo === 'Juego De Competición Liga') {
      this.navCtrl.navigateForward('/juego-competicion-liga');
    } else if (juego.Tipo === 'Juego De Competición Fórmula Uno') {
      this.navCtrl.navigateForward('/juego-competicion-f1');
    } else if (juego.Tipo === 'Juego De Cuestionario') {
      this.navCtrl.navigateForward('/juego-de-cuestionario');
    } else {
      this.navCtrl.navigateForward('/juego-colleccion');
    }
  }

  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };
}
