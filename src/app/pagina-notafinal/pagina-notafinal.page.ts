import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeticionesAPIService, SesionService} from '../servicios';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {Alumno, Equipo, Rubrica, TablaHistorialPuntosAlumno} from '../clases';
import {AlumnoJuegoDeEvaluacion} from '../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../clases/EquipoJuegoDeEvaluacion';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-pagina-notafinal',
  templateUrl: './pagina-notafinal.page.html',
  styleUrls: ['./pagina-notafinal.page.scss'],
})
export class PaginaNotafinalPage implements OnInit {

  rutaId: number;
  notaFinal: number;
  juego: JuegoDeEvaluacion;
  rubrica: Rubrica;
  respuestas: any[];
  evaluacionesPendientes: number;
  evaluacionesARecibir: number;
  alumnos: Alumno[];
  miAlumno: Alumno;
  equipos: Equipo[];
  miEquipo: Equipo;
  equiposEvaluadores: any[];
  evaluacionIndividual: boolean;

  constructor(
      private route: ActivatedRoute,
      private peticionesAPI: PeticionesAPIService,
      private sesion: SesionService
  ) {
    this.rutaId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  ngOnInit() {
    this.notaFinal = this.sesion.DameNotaFinal();
    this.juego = this.sesion.DameJuegoEvaluacion();
    this.evaluacionesPendientes = this.sesion.DameEvaluacionesPendientes();
    this.evaluacionesARecibir = this.sesion.DameEvaluacionesARecibir();
    this.alumnos = this.sesion.DameAlumnos();
    this.miAlumno = this.sesion.DameAlumno();
    this.equipos = this.sesion.DameEquipos();
    this.miEquipo = this.sesion.DameEquipo();
   
    console.log ('evaluacioens pendientes');
    console.log (this.evaluacionesPendientes);
    this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
      this.rubrica = res;
    });
    this.respuestas = this.sesion.DameRespuestas();
    console.log(this.respuestas);
    if (this.juego.Modo === 'Equipos') {
      const equipos = this.sesion.DameEquiposJuegoDeEvaluacion();
      // aqui averiguo si los evaluadores son alumnos o equipos
      if (equipos[0].alumnosEvaluadoresIds) {
        this.evaluacionIndividual = true;
      } else {
        this.evaluacionIndividual = false;

      }
      this.PreparaNombresEquipos ();
      console.log ('Ya estan los nombres de los equipos ', this.equiposEvaluadores);
    }


   
  }

  CalcularNotaCriterio(index: number): number {
    let subNota: number;
    let notaCriterio = 0;
    if (this.juego.metodoSubcriterios) {
      subNota = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.respuestas.length; i++) {
        for (let j = 1; j < this.juego.Pesos[index].length; j++) {
          if (this.respuestas[i].respuesta[index][j - 1]) {
            subNota += this.juego.Pesos[index][j] / 10;
          }
          notaCriterio += subNota / this.respuestas.length;
          subNota = 0;
        }
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.respuestas.length; i++) {
        subNota = 10;
        const fallos = this.respuestas[i].respuesta[index].filter(item => item === false).length;
        if (fallos > 0) {
          let minimo: number;
          let rangoMinimo;
          let maximo: number;
          minimo = Math.min.apply(Math, this.juego.Penalizacion[index].map(item => item.num));
          if (fallos >= minimo) {
            rangoMinimo = this.juego.Penalizacion[index].filter(item => item.num <= fallos);
            if (rangoMinimo.length === 0) {
              maximo = Math.max.apply(Math, this.juego.Penalizacion[index].map(item => item.num));
            } else {
              maximo = Math.max.apply(Math, rangoMinimo.map(item => item.num));
            }
            const penalizacion = this.juego.Penalizacion[index].find(item => item.num === maximo).p;
            subNota = penalizacion / 10;
          }
        }
        notaCriterio += subNota / this.respuestas.length;
      }
    }
    return Math.round((notaCriterio + Number.EPSILON) * 100) / 100;
  }

  CalcularNotaCriterioIndividual(participante: number, criterio: number): number {
    let subNota: number;
    let notaCriterio = 0;
    if (this.juego.metodoSubcriterios) {
      subNota = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let j = 1; j < this.juego.Pesos[criterio].length; j++) {
          if (this.respuestas[participante].respuesta[criterio][j - 1]) {
            subNota += this.juego.Pesos[criterio][j] / 10;
          }
          notaCriterio += subNota;
          subNota = 0;
      }
    } else {
      // tslint:disable-next-line:prefer-for-of

        subNota = 10;
        const fallos = this.respuestas[participante].respuesta[criterio].filter(item => item === false).length;
        if (fallos > 0) {
          let minimo: number;
          let rangoMinimo;
          let maximo: number;
          minimo = Math.min.apply(Math, this.juego.Penalizacion[criterio].map(item => item.num));
          if (fallos >= minimo) {
            rangoMinimo = this.juego.Penalizacion[criterio].filter(item => item.num <= fallos);
            if (rangoMinimo.length === 0) {
              maximo = Math.max.apply(Math, this.juego.Penalizacion[criterio].map(item => item.num));
            } else {
              maximo = Math.max.apply(Math, rangoMinimo.map(item => item.num));
            }
            const penalizacion = this.juego.Penalizacion[criterio].find(item => item.num === maximo).p;
            subNota = penalizacion / 10;
          }
        }
        notaCriterio += subNota;
    }
    return Math.round((notaCriterio + Number.EPSILON) * 100) / 100;
  }

  ContarPuntuacion(i: number, j: number): number {
    return this.respuestas.map(item => item.respuesta[i][j]).filter(item => item === true).length;
  }
  ContarPuntuacionIndividual(i: number, j: number, k: number): number {
    if (this.respuestas[i].respuesta[j][k]) {
      return 1;
    } else {
      return 0;
    }
  }

  MostrarComentario(i: number): string {
    // console.log('mostrar comentario', this.respuestas[i].respuesta[this.respuestas[i].respuesta.length - 1]);
    return this.respuestas[i].respuesta[this.respuestas[i].respuesta.length - 1];
  }

  
  DameNombreAlumno(id): string {
    const alumno: Alumno = this.alumnos.find(item => item.id === id);
    if (typeof alumno === 'undefined') {
        return;
    }
    return alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido;
  }
  
  DameUrlImagenPerfil(id): string {
    const alumno: Alumno = this.alumnos.find(item => item.id === id);
    if (typeof alumno === 'undefined') {
        return;
    }
    return alumno.ImagenPerfil;
  }
  DameNombreEquipo(alumnoId): string {
    const item = this.equiposEvaluadores.filter (elem => elem.alumnoId === alumnoId)[0];
    if (item) {
      return item.equipo.Nombre;
    }
  }
  DameUrlImagenPerfilEquipo(alumnoId): string {
    const item = this.equiposEvaluadores.filter (elem => elem.alumnoId === alumnoId)[0];
    if (item) {
      return item.equipo.FotoEquipo;
    }
  }


  async PreparaNombresEquipos() {
    this.equiposEvaluadores = [];
    console.log ('voy a preparar equipos evaluadores a partir de ', this.respuestas);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.respuestas.length; i++) {
      if (this.respuestas[i].alumnoId) {
        console.log ('respuesta ', this.respuestas[i]);
        const equiposDelAlumno = await this.peticionesAPI.DameEquiposDelAlumno (this.respuestas[i].alumnoId).toPromise();

        // Busco el equipo que esta tanto en la lista de equipos del juego como en la lista de equipso del
        // alumno
        const equipoEvaluador = equiposDelAlumno.filter(e => this.equipos.some(a => a.id === e.id))[0];

        console.log ('Equipo Evaluador ', equipoEvaluador);
        this.equiposEvaluadores.push ({
          alumnoId : this.respuestas[i].alumnoId,
          equipo: equipoEvaluador
        });
      }
    }
    console.log ('ya estan ', this.equiposEvaluadores);
  }

  EsAutoevaluacion(alumnoId: number): boolean {
    console.log ('voy a ver si es auto');
    if (this.juego.Modo === 'Individual' || this.evaluacionIndividual) {
      return (alumnoId === this.miAlumno.id);
    } else {
      // Me assguro de que ya está preparada la lista de equipos evaluadores
      if (this.equiposEvaluadores.length > 0) {
      const equipoEvaluador = this.equiposEvaluadores.filter (elem => elem.alumnoId === alumnoId)[0].equipo;
      return (equipoEvaluador.id === this.miEquipo.id);
      } else {
        return false;
      }
    }
  }



}
