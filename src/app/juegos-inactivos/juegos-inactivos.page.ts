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
    this.DameJuegosAlumno(this.id);
  }
  async DameJuegosAlumno (id) {
    const listas =  await this.calculos.DameJuegosAlumno(id);
    this.JuegosInactivos = listas.inactivos;
  }

}
