import {Component, OnInit} from '@angular/core';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {Alumno, Equipo} from '../clases';
import {PeticionesAPIService, SesionService} from '../servicios';
import {AlumnoJuegoDeEvaluacion} from '../clases/AlumnoJuegoDeEvaluacion';
import {EquipoJuegoDeEvaluacion} from '../clases/EquipoJuegoDeEvaluacion';
import {NavController} from '@ionic/angular';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-juego-evaluacion',
  templateUrl: './juego-evaluacion.page.html',
  styleUrls: ['./juego-evaluacion.page.scss'],
})
export class JuegoEvaluacionPage implements OnInit {
  data: any;
  respuestaEvaluacion: any;
  respuestaProfesor: any;
  evaluadores: any;

  constructor(
      private sesion: SesionService,
      private peticionesAPI: PeticionesAPIService,
      private navCtrl: NavController
  ) {}

  juego: JuegoDeEvaluacion;
  miAlumno: Alumno;
  miEquipo: Equipo;
  alumnosJuegoDeEvaluacion: AlumnoJuegoDeEvaluacion[] = [];
  alumnos: Alumno[] = [];
  equiposJuegoDeEvaluacion: EquipoJuegoDeEvaluacion[] = [];
  equipos: Equipo[] = [];
  alumnosDeMiEquipo: Alumno[];
  equiposPorEquipos: boolean;
  mostrandoRecibidas = false;
  alumnosDeEquipo = [];

  ngOnInit() {
      this.juego = this.sesion.DameJuegoEvaluacion();
      this.miAlumno = this.sesion.DameAlumno();
      if (this.juego.Modo === 'Individual') {
          this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juego.id)
              .subscribe((res: AlumnoJuegoDeEvaluacion[]) => {
                  this.alumnosJuegoDeEvaluacion = res;
                  console.log ('alumnos');
                  console.log ((this.alumnosJuegoDeEvaluacion));
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
                // me traigo los alumnos de cada equipo
                this.equipos.forEach((equipo) => {
                    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
                    .subscribe((res2: Alumno[]) => {
                        const obj = {equipoId: equipo.id, alumnos: res2};
                        this.alumnosDeEquipo.push(obj);
                    });
                });
              });
       
        // necesitare los nombres de los alumnmo en el caso de evaluadores individuales
          this.peticionesAPI.DameAlumnosGrupo(this.juego.grupoId)
              .subscribe((res: Alumno[]) => {
                  this.alumnos = res;
                  this.sesion.TomaAlumnos(this.alumnos);
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
  PrepararRespuestasRecibidas() {
    if (this.juego.Modo === 'Individual') {
        const respuestas = this.alumnosJuegoDeEvaluacion.find(item => item.alumnoId === this.miAlumno.id).respuestas;
        console.log ('respuestas a mostrar');
        console.log (respuestas);

        const respuestasAlumnos = respuestas.filter (item => item.alumnoId);
        this.respuestaEvaluacion = respuestasAlumnos.map(item => item.respuesta);
        // puede que haya también respuesta del profeesor
        const respuestaProfesor = respuestas.filter (item => item.profesorId);
        this.respuestaProfesor = respuestaProfesor.map(item => item.respuesta);
          // Eso me da un vector con una sola posición. La respuesta es el contenido de esa posición
        this.respuestaProfesor =  this.respuestaProfesor [0];
        // preparo los nombres de los evaluadores
        let evaluadoresId = respuestas.map(item => item.alumnoId);
        // Si entre los evaluadores esta el profesor entonces mete un undefined que lo elimino a continuación
        evaluadoresId = evaluadoresId.filter (evaluador => evaluador !== undefined);

        this.evaluadores = [];
        evaluadoresId.forEach (id => {
            this.evaluadores.push (this.alumnos.find (alumno => alumno.id === Number(id)));
        });


      } else if (this.juego.Modo === 'Equipos' ) {

        const respuestas = this.equiposJuegoDeEvaluacion.find(item => item.equipoId === this.miEquipo.id).respuestas;

        const respuestasAlumnos = respuestas.filter (item => item.alumnoId);
        this.respuestaEvaluacion = respuestasAlumnos.map(item => item.respuesta);
        // puede que haya también respuesta del profeesor
        const respuestaProfesor = respuestas.filter (item => item.profesorId);
        this.respuestaProfesor = respuestaProfesor.map(item => item.respuesta);
          // Eso me da un vector con una sola posición. La respuesta es el contenido de esa posición
        this.respuestaProfesor =  this.respuestaProfesor [0];
        // preparo los nombres de los evaluadores
        let evaluadoresId = respuestas.map(item => item.alumnoId);
        // Si entre los evaluadores esta el profesor entonces mete un undefined que lo elimino a continuación
        evaluadoresId = evaluadoresId.filter (evaluador => evaluador !== undefined);



        //// ESTO ES LO QUE HAY QUE HACER PARA PREPARAR LOS NOMBRES DE LOS EVALUADORES SI LOS EVALUADORES SON EQUIPOS
        // A partir de los id de los alumnos evaluadores creo la lista de los nombres de los equipos a los que pertenecen.
        if (this.equiposJuegoDeEvaluacion[0].alumnosEvaluadoresIds === null) {
            console.log('Equipos evaluados por equipos');
            this.evaluadores = [];
            evaluadoresId.forEach (id => {
                // averiguar de qué equipo es el alumno
              const equipoId = this.alumnosDeEquipo.find (equipo => equipo.alumnos.some (alumno => alumno.id === id)).equipoId;
              const nombreEquipo = this.equipos.find (equipo => equipo.id === equipoId).Nombre;
              this.evaluadores.push (nombreEquipo);
            });
          } else {
            //// ESTO ES LO QUE HAY QUE HACER PARA PREPARAR LOS NOMBRES DE LOS EVALUADORES SI LOS EVALUADORES SON ALUMNOS

            this.evaluadores = [];
            evaluadoresId.forEach (id => {
                this.evaluadores.push (this.alumnos.find (alumno => alumno.id === Number(id)));
            });

          }
        }

  }

}
