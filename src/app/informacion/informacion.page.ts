import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { SesionService} from '../servicios/sesion.service';
import {  Juego, Equipo, Alumno, AlumnoJuegoDePuntos, Nivel, Punto} from '../clases/index';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  juegoSeleccionado: Juego;
  TodosLosNiveles: Nivel[] = [];
  TodosLosPuntos: Punto[] = [];
  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameNivelesJuegoDePuntos(this.juegoSeleccionado.id).subscribe(
      niveles => {
        this.TodosLosNiveles = niveles;
        console.log(this.TodosLosNiveles);
        this.peticionesAPI.DamePuntosJuegoDePuntos(this.juegoSeleccionado.id).subscribe(
          puntos => {
            this.TodosLosPuntos = puntos;
            console.log(this.TodosLosPuntos);
          }
        );
      }
    );
  }

}
