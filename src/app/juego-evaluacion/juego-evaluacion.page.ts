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
  notaFinal: number;
  hayRespuestas: boolean;
  respuestas: any[];


  evaluacionesPendientes: number;
  evaluacionesARecibir: number;
  evaluacionesRecibidas: number;

  constructor(
      private sesion: SesionService,
      private peticionesAPI: PeticionesAPIService,
      private navCtrl: NavController
  ) {
      this.notaFinal = -1;
  }

  ngOnInit() {
      this.juego = this.sesion.DameJuegoEvaluacion();
      console.log ('JUEGO ', this.juego);
      this.miAlumno = this.sesion.DameAlumno();
  
      if (this.juego.Modo === 'Individual') {
          this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juego.id)
              .subscribe((res: AlumnoJuegoDeEvaluacion[]) => {
                  this.alumnosJuegoDeEvaluacion = res;
                  console.log ('alumnos');
                  console.log ((this.alumnosJuegoDeEvaluacion));
                  const respuestas = this.alumnosJuegoDeEvaluacion.find(item => item.alumnoId === this.miAlumno.id).respuestas;
                  console.log ('respuestas a mostrar');
                  console.log (respuestas);
                  this.hayRespuestas = (respuestas !== null);
                  this.sesion.TomaAlumnosJuegoDeEvaluacion(this.alumnosJuegoDeEvaluacion);
                  this.MiNotaFinal();
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
                      setTimeout(() => this.MiNotaFinal(), 500);
                  });

                  this.peticionesAPI.DameRelacionEquiposJuegoEvaluado(this.juego.id)
                    .subscribe((res: EquipoJuegoDeEvaluacion[]) => {
                        this.equiposJuegoDeEvaluacion = res;
                        this.respuestas = this.equiposJuegoDeEvaluacion.find(item => item.equipoId === this.miEquipo.id).respuestas;
                        this.hayRespuestas = (this.respuestas !== null);
                        this.equiposPorEquipos = res[0].alumnosEvaluadoresIds === null;
                        if (!this.equiposPorEquipos) {
                            console.log ('EQUIPOS CON EVALUACION INDIVIDUAL');
                            console.log ('repsuestas de momento ', this.respuestas);
                        }
                        this.sesion.TomaEquiposJuegoDeEvaluacion(this.equiposJuegoDeEvaluacion);
                        this.equiposJuegoDeEvaluacion.forEach((equipoRelacion: EquipoJuegoDeEvaluacion) => {
                            this.peticionesAPI.DameAlumnosEquipo(equipoRelacion.equipoId)
                                .subscribe((res2: Alumno[]) => {
                                    const obj = {equipoId: equipoRelacion.equipoId, alumnos: res2};
                                    this.alumnosDeEquipo.push(obj);
                                });
                        });
                  });
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

  CalcularNotaFinal(respuestas: any[]): number {
      let notaFinal = 0;
      let notaProfesor: number;
      let media = 0;
      let evaluadores = 0;
      console.log('Calcular nota de respuestas', respuestas);
      if (this.juego.metodoSubcriterios) {
          // tslint:disable-next-line:prefer-for-of
          for (let n = 0, notaEvaluador = 0; n < respuestas.length; n++, notaEvaluador = 0) {
              for (let i = 0, notaCriterio = 0; i < this.juego.Pesos.length; i++, notaCriterio = 0) {
                  for (let j = 1; j < this.juego.Pesos[i].length; j++) {
                      if (respuestas[n].respuesta[i][j - 1]) {
                          notaCriterio += this.juego.Pesos[i][j] / 10;
                      }
                  }
                  notaEvaluador += notaCriterio * this.juego.Pesos[i][0] / 100;
              }
              notaEvaluador = Math.round((notaEvaluador + Number.EPSILON) * 100) / 100;
              if (!respuestas[n].hasOwnProperty('profesorId')) {
                  media += notaEvaluador;
                  evaluadores++;
                  console.log('nota evaluador', notaEvaluador);
              } else {
                  notaProfesor = notaEvaluador;
                  console.log('nota profesor', notaProfesor);
              }
          }
      } else {
          for (let n = 0, notaEvaluador = 0; n < respuestas.length; n++, notaEvaluador = 0) {
              for (let i = 0, notaCriterio = 10; i < this.juego.Penalizacion.length - 1; i++, notaCriterio = 10) {
                  const fallos = respuestas[n].respuesta[i].filter(item => item === false).length;
                  if (fallos > 0) {
                      let minimo: number;
                      let rangoMinimo;
                      let maximo: number;
                      minimo = Math.min.apply(Math, this.juego.Penalizacion[i].map(item => item.num));
                      if (fallos >= minimo) {
                          rangoMinimo = this.juego.Penalizacion[i].filter(item => item.num <= fallos);
                          if (rangoMinimo.length === 0) {
                              maximo = Math.max.apply(Math, this.juego.Penalizacion[i].map(item => item.num));
                          } else {
                              maximo = Math.max.apply(Math, rangoMinimo.map(item => item.num));
                          }
                          const penalizacion = this.juego.Penalizacion[i].find(item => item.num === maximo).p;
                          notaCriterio = penalizacion / 10;
                      }
                  }
                  notaEvaluador += notaCriterio * this.juego.Penalizacion[this.juego.Penalizacion.length - 1][i] / 100;
              }
              notaEvaluador = Math.round((notaEvaluador + Number.EPSILON) * 100) / 100;
              if (!respuestas[n].hasOwnProperty('profesorId')) {
                  media += notaEvaluador;
                  evaluadores++;
                  console.log('nota evaluador', notaEvaluador);
              } else {
                  notaProfesor = notaEvaluador;
                  console.log('nota profesor', notaProfesor);
              }
          }
      }

      // Si el profesor no evalua o todavía no ha evaluado
      if (!this.juego.profesorEvalua || notaProfesor === undefined) {
          notaFinal = Math.round(((media / evaluadores) + Number.EPSILON) * 100) / 100;
      } else if (this.juego.profesorEvalua && this.juego.notaProfesorNormal) {
          notaFinal = Math.round((((media + notaProfesor) / (evaluadores + 1)) + Number.EPSILON) * 100) / 100;
      } else if (this.juego.profesorEvalua && !this.juego.notaProfesorNormal) {
          notaFinal = Math.round(((((media / evaluadores) + notaProfesor) / 2) + Number.EPSILON) * 100) / 100;
      }

      this.sesion.TomaNotaFinal(notaFinal);
 
      return notaFinal;
  }

  MiNotaFinal(): number {
      console.log ('estoy en MiNotaFinal', this.notaFinal);
     
      if (this.notaFinal !== -1) {
          return this.notaFinal;
      }
      console.log ('CALCULO NOTA FINAL');
      let miRelacion: any;
      let alumnosDeMiRelacion: number[] = [];
      let alumnosEvaluadores: number[] = [];

      this.alumnosJuegoDeEvaluacion = this.sesion.DameAlumnosJuegoDeEvaluacion();
      this.equiposJuegoDeEvaluacion = this.sesion.DameEquiposJuegoDeEvaluacion();
      if (this.juego.Modo === 'Individual' && typeof this.alumnosJuegoDeEvaluacion !== 'undefined') {

          miRelacion = this.alumnosJuegoDeEvaluacion.find(item => item.alumnoId === this.miAlumno.id);

          if (!miRelacion.respuestas) {
              return null;
          }
          // vamos a ver si aun quedan evaluaciones por hacer
          this.evaluacionesRecibidas = miRelacion.respuestas.length;
     

          alumnosEvaluadores = miRelacion.respuestas.slice().filter(item => !item.profesorId).map(item => item.alumnoId);
          console.log('alumnosEvaluadores', alumnosEvaluadores);
          this.evaluacionesARecibir = miRelacion.alumnosEvaluadoresIds.length;
          if (this.juego.profesorEvalua) {
              this.evaluacionesARecibir ++;
          }
          if (this.juego.autoEvaluacion) {
            this.evaluacionesARecibir ++;
          }


          this.evaluacionesPendientes = this.evaluacionesARecibir - this.evaluacionesRecibidas;
          console.log ('EVALUACIONES PENDIENTES 1', this.evaluacionesPendientes);

          alumnosDeMiRelacion = miRelacion.alumnosEvaluadoresIds.slice();
          console.log('alumnosDeMiRelacion', alumnosDeMiRelacion);
          if (this.juego.autoEvaluacion && !alumnosDeMiRelacion.includes(this.miAlumno.id)) {
              alumnosDeMiRelacion.push(this.miAlumno.id);
          }
        // Esto lo quito para poder ver las evaluaciones recibidas aunque no estén todas

        //   if (alumnosDeMiRelacion.sort().join(',') !== alumnosEvaluadores.sort().join(',')) {
        //       console.log('Faltan alumnos por evaluarte');
        //       return null;
        //   }
        //   console.log('Todos los alumnos te han evaluado');
        //   if (this.juego.profesorEvalua && !miRelacion.respuestas.find(item => item.profesorId === this.juego.profesorId)) {
        //       console.log('Profesor falta por evaluar');
        //       return null;
        //   }
          this.sesion.TomaRespuestas(miRelacion.respuestas);
          console.log ('voy a calcular la nota');
          this.notaFinal = this.CalcularNotaFinal(miRelacion.respuestas);
          return this.notaFinal;
      } else if (this.juego.Modo === 'Equipos' && typeof this.equiposJuegoDeEvaluacion !== 'undefined') {
          miRelacion = this.equiposJuegoDeEvaluacion.find(item => item.equipoId === this.miEquipo.id);
          console.log('mi relacion', miRelacion);
          console.log('equipos', this.equipos);
          console.log('alumnos de mi equipo', this.alumnosDeMiEquipo);
          if (!miRelacion.respuestas) {
              return null;
          }
          this.evaluacionesRecibidas = miRelacion.respuestas.length;

          alumnosEvaluadores = miRelacion.respuestas.slice().filter(item => !item.profesorId).map(item => item.alumnoId);
          console.log('alumnosEvaluadores', alumnosEvaluadores);
          if (miRelacion.alumnosEvaluadoresIds !== null) {
              // Alumnos evaluan a equipos
              this.evaluacionesARecibir = miRelacion.alumnosEvaluadoresIds.length;
              if (this.juego.profesorEvalua) {
                this.evaluacionesARecibir ++;
              }
            
              
              alumnosDeMiRelacion = miRelacion.alumnosEvaluadoresIds.slice();
              console.log('alumnosDeMiRelacion', alumnosDeMiRelacion);
              const alumnosDeMiEquipoIds = this.alumnosDeMiEquipo.map(item => item.id);
              if (this.juego.autoEvaluacion) {
                  alumnosDeMiEquipoIds.forEach((id: number) => {
                      if (!alumnosDeMiRelacion.includes(id)) {
                          alumnosDeMiRelacion.push(id);
                      }
                  });
                  this.evaluacionesARecibir = this.evaluacionesARecibir + alumnosDeMiEquipoIds.length;
                  console.log('alumnosDeMiRelacion', alumnosDeMiRelacion);
              }
              this.evaluacionesPendientes = this.evaluacionesARecibir - this.evaluacionesRecibidas;
          
            //   if (alumnosDeMiRelacion.sort().join(',') !== alumnosEvaluadores.sort().join(',')) {
            //       console.log('Faltan alumnos por evaluarte');
            //       return null;
            //   }
            //   console.log('Todos los alumnos te han evaluado');
            //   if (this.juego.profesorEvalua && !miRelacion.respuestas.find(item => item.profesorId === this.juego.profesorId)) {
            //       console.log('Profesor falta por evaluar');
            //       return null;
            //   }
              this.sesion.TomaRespuestas(miRelacion.respuestas);
              return this.CalcularNotaFinal(miRelacion.respuestas);
          } else {
              this.evaluacionesARecibir = miRelacion.equiposEvaluadoresIds.length;
              if (this.juego.profesorEvalua) {
                this.evaluacionesARecibir ++;
              }
              if (this.juego.autoEvaluacion) {
                this.evaluacionesARecibir ++;
              }
              
              this.evaluacionesPendientes = this.evaluacionesARecibir - this.evaluacionesRecibidas;
              console.log ('EVALUACIONES PENDIENTES 2', this.evaluacionesPendientes);
              const equiposEvaluadores = [];
              this.alumnosDeEquipo.forEach((item) => {
                  const alumnosIds = item.alumnos.map(a => a.id);
                  if (alumnosIds.find(id => alumnosEvaluadores.includes(id)) && !equiposEvaluadores.includes(item.equipoId)) {
                      equiposEvaluadores.push(item.equipoId);
                  }
              });
              console.log('equipos evaluadores', equiposEvaluadores);
              const equiposDeMiRelacion = miRelacion.equiposEvaluadoresIds;
              console.log('equipos de mi relacion', equiposDeMiRelacion);
              if (this.juego.autoEvaluacion && !equiposDeMiRelacion.includes(this.miEquipo.id)) {
                  equiposDeMiRelacion.push(this.miEquipo.id);
                  console.log('equipos de mi relacion', equiposDeMiRelacion);
              }
                 // Esto lo quito para poder ver las evaluaciones recibidas aunque no estén todas
            //   if (equiposDeMiRelacion.sort().join(',') !== equiposEvaluadores.sort().join(',')) {
            //       console.log('Faltan equipos por evaluarte');
            //       return null;
            //   }
            //   console.log('Todos los equipos te han evaluado');
            //   if (this.juego.profesorEvalua && !miRelacion.respuestas.find(item => item.profesorId === this.juego.profesorId)) {
            //       console.log('Profesor falta por evaluar');
            //       return null;
            //   }
              this.sesion.TomaRespuestas(miRelacion.respuestas);
              this.notaFinal = this.CalcularNotaFinal(miRelacion.respuestas);
              return this.notaFinal;
          }
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

  VerNotaFinal(id: number) {
    console.log ('envio evaluaciones pendientes');
    console.log (this.evaluacionesPendientes);
    this.sesion.TomaRespuestas (this.respuestas);
    this.sesion.TomaEvaluacionesPendientes (this.evaluacionesPendientes);
    this.sesion.TomaEvaluacionesARecibir (this.evaluacionesARecibir);
    this.navCtrl.navigateForward('/pagina-notafinal/' + id).then();
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
        console.log ('respuestas compañeros');
        console.log (this.respuestaEvaluacion);
        console.log ('respuestas profesor');
        console.log (respuestaProfesor);
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
