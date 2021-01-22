import {Component, OnInit} from '@angular/core';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {Alumno, Equipo} from '../clases';
import {PeticionesAPIService, SesionService} from '../servicios';
import {AlumnoJuegoDeEvaluacion} from '../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../clases/EquipoJuegoDeEvaluacion';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-juego-evaluacion',
  templateUrl: './juego-evaluacion.page.html',
  styleUrls: ['./juego-evaluacion.page.scss'],
})
export class JuegoEvaluacionPage implements OnInit {

  juego: JuegoDeEvaluacion;
  miAlumno: Alumno;
  miEquipo: Equipo;
  alumnosJuegoDeEvaluacion: AlumnoJuegoDeEvaluacion[] = [];
  alumnos: Alumno[] = [];
  equiposJuegoDeEvaluacion: EquipoJuegoDeEvaluacion[] = [];
  equipos: Equipo[] = [];
  alumnosDeMiEquipo: Alumno[];
  equiposPorEquipos: boolean;

  constructor(
      private sesion: SesionService,
      private peticionesAPI: PeticionesAPIService,
      private navCtrl: NavController
  ) {}

  ngOnInit() {
      this.juego = this.sesion.DameJuegoEvaluacion();
      this.miAlumno = this.sesion.DameAlumno();
      if (this.juego.Modo === 'Individual') {
          this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juego.id)
              .subscribe((res: AlumnoJuegoDeEvaluacion[]) => {
                  this.alumnosJuegoDeEvaluacion = res;
                  this.sesion.TomaAlumnosJuegoDeEvaluacion(this.alumnosJuegoDeEvaluacion);
              });
          this.peticionesAPI.DameAlumnosJuegoDeEvaluacion(this.juego.id)
              .subscribe((res: Alumno[]) => {
                  this.alumnos = res;
                  this.sesion.TomaAlumnos(this.alumnos);
              });
      } else if (this.juego.Modo === 'Equipos') {
          this.peticionesAPI.DameEquipoDeAlumno(this.juego.grupoId, this.miAlumno.id)
              .subscribe((equipo: Equipo[]) => {
                  this.miEquipo = equipo[0];
                  this.sesion.TomaEquipo(this.miEquipo);
                  this.peticionesAPI.DameAlumnosEquipo(this.miEquipo.id).subscribe((res: Alumno[]) => {
                      this.alumnosDeMiEquipo = res;
                      this.sesion.TomaAlumnosDeMiEquipo(this.alumnosDeMiEquipo);
                  });
              });
          this.peticionesAPI.DameRelacionEquiposJuegoEvaluado(this.juego.id)
              .subscribe((res: EquipoJuegoDeEvaluacion[]) => {
                  this.equiposJuegoDeEvaluacion = res;
                  this.equiposPorEquipos = res[0].alumnosEvaluadoresIds === null;
                  this.sesion.TomaEquiposJuegoDeEvaluacion(this.equiposJuegoDeEvaluacion);
              });
          this.peticionesAPI.DameEquiposJuegoDeEvaluacion(this.juego.id)
              .subscribe((res: Equipo[]) => {
                  this.equipos = res;
                  this.sesion.TomaEquipos(this.equipos);
              });
      }
  }

  EstadoEvaluacion(id: number): boolean {
      this.alumnosJuegoDeEvaluacion = this.sesion.DameAlumnosJuegoDeEvaluacion();
      this.equiposJuegoDeEvaluacion = this.sesion.DameEquiposJuegoDeEvaluacion();
      if (this.juego.Modo === 'Individual' && typeof this.alumnosJuegoDeEvaluacion !== 'undefined') {
          const relacion = this.alumnosJuegoDeEvaluacion.find(item => item.alumnoId === id);
          if (!relacion || !relacion.respuestas) {
              return false;
          }
          return relacion.respuestas.find(item => item.alumnoId === this.miAlumno.id);
      } else if (this.juego.Modo === 'Equipos' && typeof this.equiposJuegoDeEvaluacion !== 'undefined') {
          const relacion = this.equiposJuegoDeEvaluacion.find(item => item.equipoId === id);
          if (!relacion || !relacion.respuestas) {
              return false;
          }
          const miRespuesta = relacion.respuestas.find(item => item.alumnoId === this.miAlumno.id);
          if (miRespuesta) {
              return true;
          }
          return !!(this.equiposPorEquipos &&
              typeof this.alumnosDeMiEquipo !== 'undefined' &&
              relacion.respuestas.find(item => this.alumnosDeMiEquipo.map(a => a.id).includes(item.alumnoId)));
      }
  }

  VerPaginaEvaluar(id: number) {
      this.navCtrl.navigateForward('/pagina-evaluar/' + id).then();
  }

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

  DameFotoEquipo(id): string {
      const equipo: Equipo = this.equipos.find(item => item.id === id);
      if (typeof equipo === 'undefined') {
          return;
      }
      return equipo.FotoEquipo;
  }

}
