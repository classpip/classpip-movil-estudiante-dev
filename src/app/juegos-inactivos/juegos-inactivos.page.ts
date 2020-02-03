import { Component, OnInit } from '@angular/core';
import { SesionService} from '../servicios/sesion.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { Juego, Equipo } from '../clases/index';
import { Router } from '@angular/router';
@Component({
  selector: 'app-juegos-inactivos',
  templateUrl: './juegos-inactivos.page.html',
  styleUrls: ['./juegos-inactivos.page.scss'],
})
export class JuegosInactivosPage implements OnInit {

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
    this.calculos.DameJuegosAlumno(this.id)
    .subscribe ( listas => {
            this.JuegosInactivos = listas.inactivos;
            console.log('Muestro los Juegos pero luego me da que el length es 0??????');
            console.log(this.JuegosInactivos);
            console.log(this.JuegosInactivos.length);
            // Si la lista aun esta vacia la dejo como indefinida para que me
            // salga el mensaje de que aun no hay juegos

    });
    console.log ('Ya he traido los juegos Inactivos');

  }

}
