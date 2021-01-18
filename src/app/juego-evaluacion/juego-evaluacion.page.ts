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
  miAlumno: Alumno = new Alumno();
  miEquipo: Equipo = null;
  rubrica: Rubrica;
  alumnosJuegoEvaluado: AlumnoJuegoEvaluado[] = [];
  alumnos: Alumno[] = [];
  equiposJuegoEvaluado: EquipoJuegoEvaluado[] = [];
  equipos: Equipo[] = [];
  equiposPorEquipos: boolean;

  constructor(
      private sesion: SesionService,
      private peticionesAPI: PeticionesAPIService
  ) { }

  DameNombreCompleto(id): string {
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

  DameNombreEquipo(id): string {
      const equipo: Equipo = this.equipos.find(item => item.id === id);
      if (typeof equipo === 'undefined') {
          return;
      }
      return equipo.Nombre;
  }

  ngOnInit() {
      this.juego = this.sesion.DameJuegoEvaluacion();
      this.miAlumno = this.sesion.DameAlumno();
      console.log(this.juego, this.miAlumno);
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
          this.peticionesAPI.DameEquipoDeAlumno(this.juego.grupoId, this.miAlumno.id)
              .subscribe((equipo: Equipo[]) => {
                  this.miEquipo = equipo[0];
                  console.log('EquipoId', this.miEquipo.id);
              });
          this.peticionesAPI.DameEquiposJuegoEvaluado(this.juego.id)
              .subscribe((equipos: EquipoJuegoEvaluado[]) => {
                  this.equiposJuegoEvaluado = equipos;
                  console.log(this.equiposJuegoEvaluado);
                  this.equiposPorEquipos = equipos[0].alumnosEvaluadoresIds === null;
                  equipos.forEach(equipo => {
                      this.peticionesAPI.DameEquipo(equipo.equipoEvaluadoId).subscribe(res => {
                          this.equipos.push(res);
                          console.log(res);
                      });
                  });
              });
      }
  }

}
