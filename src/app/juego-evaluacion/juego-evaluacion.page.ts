import {Component, OnInit} from '@angular/core';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {Alumno, Equipo, Rubrica} from '../clases';
import {PeticionesAPIService, SesionService} from '../servicios';
import {AlumnoJuegoEvaluado} from '../clases/AlumnoJuegoEvaluado';
import {EquipoJuegoEvaluado} from '../clases/EquipoJuegoEvaluado';

@Component({
  selector: 'app-juego-evaluacion',
  templateUrl: './juego-evaluacion.page.html',
  styleUrls: ['./juego-evaluacion.page.scss'],
})
export class JuegoEvaluacionPage implements OnInit {

  juego: JuegoDeEvaluacion;
  alumno: Alumno = new Alumno();
  equipoId: number;
  rubrica: Rubrica;
  alumnosJuegoEvaluado: AlumnoJuegoEvaluado[] = [];
  alumnos: Alumno[] = [];
  equiposJuegoEvaluado: EquipoJuegoEvaluado[] = [];
  equiposPorEquipos: boolean;

  constructor(
      private sesion: SesionService,
      private peticionesAPI: PeticionesAPIService
  ) { }

  DameNombreCompleto(id): string {
      const alumno: Alumno = this.alumnos.find(item => item.id === id);
      return alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido;
  }

  DameMiNombreCompleto(): string {
      return this.DameNombreCompleto(this.alumno.id);
  }

  ngOnInit() {
      this.juego = this.sesion.DameJuegoEvaluacion();
      this.alumno = this.sesion.DameAlumno();
      console.log(this.juego, this.alumno);
      this.peticionesAPI.DameRubrica(this.juego.rubricaId)
          .subscribe((rubrica: Rubrica) => {
              this.rubrica = rubrica;
              console.log(this.rubrica);
          });
      if (this.juego.Modo === 'Individual') {
          this.peticionesAPI.DameAlumnosJuegoEvaluado(this.juego.id)
              .subscribe((alumnos: AlumnoJuegoEvaluado[]) => {
                  this.alumnosJuegoEvaluado = alumnos;
                  console.log(this.alumnosJuegoEvaluado);
                  alumnos.forEach(alumno => {
                      this.peticionesAPI.DameAlumnoConId(alumno.alumnoEvaluadoId)
                          .subscribe(res => {
                              this.alumnos.push(res);
                              console.log(res);
                          });
                  });
              });
      } else if (this.juego.Modo === 'Equipos') {
          this.peticionesAPI.DameEquipo(this.juego.grupoId, this.alumno.id)
              .subscribe((equipo: Equipo[]) => {
                  this.equipoId = equipo[0].id;
                  console.log('EquipoId', this.equipoId);
              });
          this.peticionesAPI.DameEquiposJuegoEvaluado(this.juego.id)
              .subscribe((equipos: EquipoJuegoEvaluado[]) => {
                  this.equiposJuegoEvaluado = equipos;
                  console.log(this.equiposJuegoEvaluado);
                  this.equiposPorEquipos = equipos[0].alumnosEvaluadoresIds === null;
              });
      }
  }

}
