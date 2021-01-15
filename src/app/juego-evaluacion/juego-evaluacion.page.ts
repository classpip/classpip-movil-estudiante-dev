import { Component, OnInit } from '@angular/core';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {Alumno, Juego, Rubrica} from '../clases';
import {PeticionesAPIService, SesionService} from '../servicios';
import {AlumnoJuegoEvaluado} from '../clases/AlumnoJuegoEvaluado';

@Component({
  selector: 'app-juego-evaluacion',
  templateUrl: './juego-evaluacion.page.html',
  styleUrls: ['./juego-evaluacion.page.scss'],
})
export class JuegoEvaluacionPage implements OnInit {

  juego: JuegoDeEvaluacion;
  alumno: Alumno;
  rubrica: Rubrica;
  alumnosJuegoEvaluado: AlumnoJuegoEvaluado[];

  constructor(
      private sesion: SesionService,
      private peticionesAPI: PeticionesAPIService
  ) { }

  async ngOnInit() {
    this.juego = this.sesion.DameJuegoEvaluacion();
    this.alumno = this.sesion.DameAlumno();
    console.log(this.juego, this.alumno);
    this.peticionesAPI.DameRubrica(this.juego.rubricaId)
        .subscribe((rubrica: Rubrica) => {
          this.rubrica = rubrica;
          console.log(this.rubrica);
        });
    this.peticionesAPI.DameAlumnosJuegoEvaluado(this.juego.id)
        .subscribe((alumnos: AlumnoJuegoEvaluado[]) => {
          this.alumnosJuegoEvaluado = alumnos;
          console.log(this.alumnosJuegoEvaluado);
        });
    // this.rubrica = await this.peticionesAPI.DameRubrica(this.juego.rubricaId).toPromise();
  }

}
