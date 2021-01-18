import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeticionesAPIService, SesionService} from '../servicios';
import {Alumno, Rubrica} from '../clases';
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
  rubrica: Rubrica;

  constructor(
      private route: ActivatedRoute,
      private peticionesAPI: PeticionesAPIService,
      private sesion: SesionService
  ) {
    this.juego = this.sesion.DameJuegoEvaluacion();
    this.miAlumno = this.sesion.DameAlumno();
    this.rutaId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  async ngOnInit() {
    this.rubrica = await this.peticionesAPI.DameRubrica(this.juego.rubricaId).toPromise();
  }

}
