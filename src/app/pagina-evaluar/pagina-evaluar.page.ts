import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeticionesAPIService, SesionService} from '../servicios';
import {Alumno, Criterio, Equipo, Rubrica} from '../clases';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';

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
      console.log(this.respuestaEvaluacion);
    });
    if (this.juego.Modo === 'Individual') {
      this.alumnos = this.sesion.DameAlumnos();
    } else if (this.juego.Modo === 'Equipos') {
      this.equipos = this.sesion.DameEquipos();
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

}
