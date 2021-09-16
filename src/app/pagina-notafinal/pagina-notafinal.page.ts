import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeticionesAPIService, SesionService} from '../servicios';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {Rubrica} from '../clases';
import {AlumnoJuegoDeEvaluacion} from '../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../clases/EquipoJuegoDeEvaluacion';

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
    console.log ('evaluacioens pendientes');
    console.log (this.evaluacionesPendientes);
    this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
      this.rubrica = res;
    });
    this.respuestas = this.sesion.DameRespuestas();
    console.log(this.respuestas);
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

  ContarPuntuacion(i: number, j: number): number {
    return this.respuestas.map(item => item.respuesta[i][j]).filter(item => item === true).length;
  }

  MostrarComentario(i: number): string {
    // console.log('mostrar comentario', this.respuestas[i].respuesta[this.respuestas[i].respuesta.length - 1]);
    return this.respuestas[i].respuesta[this.respuestas[i].respuesta.length - 1];
  }

}
