import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {  Juego, Equipo, Alumno} from '../clases/index';
import { SesionService} from '../servicios/sesion.service';
@Component({
  selector: 'app-puntos-mi-equipo',
  templateUrl: './puntos-mi-equipo.page.html',
  styleUrls: ['./puntos-mi-equipo.page.scss'],
})
export class PuntosMiEquipoPage implements OnInit {
  juegoSeleccionado: Juego;
  MiAlumno: Alumno;
  NuestroHistorialPuntos: any [] = [];
  MiEquipo: Equipo;
  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.MiAlumno = this.sesion.DameAlumno();
    this.NuestroHistorialPuntos = this.calculos.DameHistorialPuntosMiEquipo(this.MiAlumno.id, this.juegoSeleccionado.id);
    console.log(this.NuestroHistorialPuntos);
  }

}
