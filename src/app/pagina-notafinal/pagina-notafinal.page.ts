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
    this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
      this.rubrica = res;
    });
    this.respuestas = this.sesion.DameRespuestas();
    console.log(this.respuestas);
  }

}
