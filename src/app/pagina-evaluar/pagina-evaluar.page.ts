import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeticionesAPIService, SesionService} from '../servicios';
import {Alumno, Criterio, Equipo, Rubrica} from '../clases';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {log} from 'util';

@Component({
  selector: 'app-pagina-evaluar',
  templateUrl: './pagina-evaluar.page.html',
  styleUrls: ['./pagina-evaluar.page.scss'],
})
export class PaginaEvaluarPage implements OnInit {

  rutaId: number;
  juego: JuegoDeEvaluacion;
  miAlumno: Alumno;
  // ?juegoAlumnosDeEvaluacion
  alumnos: Alumno[];
  miEquipo: Equipo;
  // ?juegoEquiposDeEvaluacion
  equipos: Equipo[];
  rubrica: Rubrica;
  respuestaEvaluacion: Array<any>;
  // Form elements
  allCompleted: Array<boolean>;
  indeterminated: Array<boolean>;
  comentario = '';

  constructor(
      private route: ActivatedRoute,
      private peticionesAPI: PeticionesAPIService,
      private sesion: SesionService
  ) {
    this.rutaId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  ngOnInit() {
    this.juego = this.sesion.DameJuegoEvaluacion();
    this.miAlumno = this.sesion.DameAlumno();
    this.miEquipo = this.sesion.DameEquipo();
    this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
      this.rubrica = res;
      this.respuestaEvaluacion = new Array<any>(this.rubrica.Criterios.length);
      this.rubrica.Criterios.forEach((item, index) => {
        this.respuestaEvaluacion[index] = new Array<boolean>(this.rubrica.Criterios[index].Elementos.length).fill(false);
      });
      this.respuestaEvaluacion.push('');
      this.allCompleted = new Array<boolean>(this.rubrica.Criterios.length).fill(false);
      this.indeterminated = new Array<boolean>(this.rubrica.Criterios.length).fill(false);
    });
    if (this.juego.Modo === 'Individual') {
      this.alumnos = this.sesion.DameAlumnos();
    } else if (this.juego.Modo === 'Equipos') {
      this.equipos = this.sesion.DameEquipos();
    }
  }

  SetAll(i: number): void {
    if (this.respuestaEvaluacion[i] == null) {
      return;
    }
    setTimeout(() => {
      for (let j = 0; j < this.respuestaEvaluacion[i].length; j++) {
        this.respuestaEvaluacion[i][j] = this.allCompleted[i];
      }
    });
  }

  CheckboxChanged(i: number): void {
    if (this.respuestaEvaluacion[i] == null) {
      return;
    }
    const allItems = this.respuestaEvaluacion[i].length;
    const selectedItems = this.respuestaEvaluacion[i].filter(item => item === true).length;
    if (selectedItems > 0 && selectedItems < allItems) {
      this.indeterminated[i] = true;
      this.allCompleted[i] = false;
    } else if (selectedItems === allItems) {
      this.indeterminated[i] = false;
      this.allCompleted[i] = true;
    } else {
      this.indeterminated[i] = false;
      this.allCompleted[i] = false;
    }
  }

  DameNombreEvaluado(): string {
    if (this.juego.Modo === 'Individual' && typeof this.alumnos !== 'undefined') {
      const alumno: Alumno = this.alumnos.find(item => item.id === this.rutaId);
      return alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido;
    } else if (this.juego.Modo === 'Equipos' && typeof this.equipos !== 'undefined') {
      const equipo: Equipo = this.equipos.find(item => item.id === this.rutaId);
      return equipo.Nombre;
    }
  }

  DameImagenEvaluado(): string {
    if (this.juego.Modo === 'Individual' && typeof this.alumnos !== 'undefined') {
      const alumno: Alumno = this.alumnos.find(item => item.id === this.rutaId);
      return alumno.ImagenPerfil;
    } else if (this.juego.Modo === 'Equipos' && typeof this.equipos !== 'undefined') {
      const equipo: Equipo = this.equipos.find(item => item.id === this.rutaId);
      return equipo.FotoEquipo;
    }
  }

  EnviarRespuesta(): void {
    this.respuestaEvaluacion[this.respuestaEvaluacion.length - 1] = this.comentario;
    console.log(this.respuestaEvaluacion);
  }

}
