import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {  Juego, Equipo, Alumno} from '../clases/index';
import { SesionService} from '../servicios/sesion.service';
@Component({
  selector: 'app-mis-puntos',
  templateUrl: './mis-puntos.page.html',
  styleUrls: ['./mis-puntos.page.scss'],
})
export class MisPuntosPage implements OnInit {
  juegoSeleccionado: Juego;
  MiAlumno: Alumno;
  MiHistorialPuntos: any [] = [];

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.MiAlumno = this.sesion.DameAlumno();
    this.MiHistorialPuntos = this.calculos.DameHistorialMisPuntos(this.juegoSeleccionado.id, this.MiAlumno.id);
    console.log(this.MiAlumno.id);
    console.log(this.juegoSeleccionado.id);
    console.log(this.MiHistorialPuntos);

  }

}
