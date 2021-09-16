import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController } from '@ionic/angular';
import { JuegoDeVotacionUnoATodos, Alumno, AlumnoJuegoDeVotacionUnoATodos, Equipo, EquipoJuegoDeVotacionUnoATodos } from '../clases';


@Component({
  selector: 'app-juego-votacion-uno-atodos',
  templateUrl: './juego-votacion-uno-atodos.page.html',
  styleUrls: ['./juego-votacion-uno-atodos.page.scss'],
})
export class JuegoVotacionUnoATodosPage implements OnInit {
  juegoSeleccionado: any;
  alumno: Alumno;
  equipo: Equipo;
 
  inscripcionAlumnoJuegoDeVotacionUnoATodos: AlumnoJuegoDeVotacionUnoATodos;
  alumnos: Alumno[];

  inscripcionEquipoJuegoDeVotacionUnoATodos: EquipoJuegoDeVotacionUnoATodos;
  equipos: Equipo[];

  alumnosVotados: any[];
  equiposVotados: any[];
  puntos = 50;
  alumnosConPuntos: any[];
  equiposConPuntos: any[];
  puntosARepartir: number;

  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private comServer: ComServerService
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntosARepartir = this.juegoSeleccionado.Puntos[0];
    this.alumno = this.sesion.DameAlumno();

    if (this.juegoSeleccionado.Modo === 'Individual') {
       // Traigo la inscripción del alumno
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id, this.alumno.id)
      .subscribe (inscripcion => {
        this.inscripcionAlumnoJuegoDeVotacionUnoATodos = inscripcion[0];
        // traigo los alumnos del juego
        this.peticionesAPI.DameAlumnosJuegoDeVotacionUnoATodos (this.juegoSeleccionado.id)
        .subscribe (alumnos => {
          this.alumnos = alumnos;
        
          if (this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos) {
              // Si ha votado preparlo la lista solo con los alumnos a los que ha votado
              // para mostrar el resultado de su votación
              this.alumnosVotados = [];
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos.length; i++) {
                // tslint:disable-next-line:max-line-length
                const alumno = this.alumnos.filter (al => al.id === this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i].alumnoId)[0];
                this.alumnosVotados.push ({
                  al: alumno,
                  puntos: this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i].puntos
                });
              }
              // tslint:disable-next-line:only-arrow-functions
              this.alumnosVotados = this.alumnosVotados.sort(function(a, b) {
                return b.puntos - a.puntos;
              });
          }
          if (this.juegoSeleccionado.ModoReparto === 'Reparto libre') {
            this.alumnosConPuntos = [];
            this.alumnos.forEach (alumno =>
              this.alumnosConPuntos.push ({
                al: alumno,
                puntos: 0
              })
            );
          }
        });

      });
    } else {
      // averiguo el equipo del alumno
      this.peticionesAPI.DameEquipoDeAlumno(this.juegoSeleccionado.grupoId, this.alumno.id)
      .subscribe((equipo: Equipo[]) => {
          this.equipo = equipo[0];
          // Traigo la inscripción del equipo
          this.peticionesAPI.DameInscripcionEquipoJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id, this.equipo.id)
          .subscribe (inscripcion => {
            this.inscripcionEquipoJuegoDeVotacionUnoATodos = inscripcion[0];
            // traigo los equipos del juego
            this.peticionesAPI.DameEquiposJuegoDeVotacionUnoATodos (this.juegoSeleccionado.id)
            .subscribe (equipos => {
              this.equipos = equipos;
            
              if (this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos) {
                  // Si han votado preparlo la lista solo con los equipos a los que han votado
                  // para mostrar el resultado de su votación
                  this.equiposVotados = [];
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    const equipo = this.equipos.filter (eq => eq.id === this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos[i].equipoId)[0];
                    this.equiposVotados.push ({
                      eq: equipo,
                      puntos: this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos[i].puntos
                    });
                  }
                  // tslint:disable-next-line:only-arrow-functions
                  this.equiposVotados = this.equiposVotados.sort(function(a, b) {
                    return b.puntos - a.puntos;
                  });
              }
              if (this.juegoSeleccionado.ModoReparto === 'Reparto libre') {
                this.equiposConPuntos = [];
                this.equipos.forEach (equipo =>
                  this.equiposConPuntos.push ({
                    eq: equipo,
                    puntos: 0
                  })
                );
              }
            });
    
          });
      });

    }
  }

  // Esta función se ejecuta cuando movemos a los alumnos o equipos de posición en la lista
  reorderItems(event) {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      const itemMove = this.alumnos.splice(event.detail.from, 1)[0];
      this.alumnos.splice(event.detail.to, 0, itemMove);
      event.detail.complete();
    } else {
      const itemMove = this.equipos.splice(event.detail.from, 1)[0];
      this.equipos.splice(event.detail.to, 0, itemMove);
      event.detail.complete();
    }
  }

  Incrementar(i) {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      if (this.puntosARepartir > 0) {
        this.alumnosConPuntos[i].puntos++;
        this.puntosARepartir--;
      }
    } else {
        if (this.puntosARepartir > 0) {
          this.equiposConPuntos[i].puntos++;
          this.puntosARepartir--;
        }
    }
  }

  Decrementar(i) {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      if ( this.alumnosConPuntos[i].puntos > 0) {
        this.alumnosConPuntos[i].puntos--;
        this.puntosARepartir++;
      }
    } else {
      if ( this.equiposConPuntos[i].puntos > 0) {
        this.equiposConPuntos[i].puntos--;
        this.puntosARepartir++;
      }

    }
  }

  // función para enviar la votación. Es async porque usa una alarma
  async Enviar() {
    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres enviar tu votación?',
      buttons: [
        {
          text: 'SI',
          handler: async () => {

            if (this.juegoSeleccionado.Modo === 'Individual') {
              this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos = [];
              if (this.juegoSeleccionado.ModoReparto !== 'Reparto libre') {
                // Guardo los identificadores de los alumnos a los que ha votado (que estan en las primeras posiciones de la lista)
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.juegoSeleccionado.Puntos.length; i++) {
                  this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos.push ({
                    alumnoId: this.alumnos[i].id,
                    puntos:  this.juegoSeleccionado.Puntos[i]
                  });
                }
              } else {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.alumnosConPuntos.length; i++) {
                  this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos.push ({
                    alumnoId: this.alumnosConPuntos[i].al.id,
                    puntos:  this.alumnosConPuntos[i].puntos
                  });
                }

              }
              // Notifico al server que el alumno ha votado
              this.comServer.Emitir('notificarVotacion', { votacion: this.inscripcionAlumnoJuegoDeVotacionUnoATodos});

              this.peticionesAPI.RegistraVotacion (this.inscripcionAlumnoJuegoDeVotacionUnoATodos)
              .subscribe (async () => {
                // tslint:disable-next-line:no-shadowed-variable
                const confirm = await this.alertCtrl.create({
                  header: 'Votación registrada con éxito',
                  buttons: [
                    {
                      text: 'OK',
                      handler: async () => {
                        // Ahora ya he votado. Preparo la lista de los alumnos votados

                        this.alumnosVotados = [];
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos.length; i++) {
                          // tslint:disable-next-line:max-line-length
                          const alumno = this.alumnos.filter (al => al.id === this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i].alumnoId)[0];
                          this.alumnosVotados.push ({
                            al: alumno,
                            puntos: this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i].puntos
                          });
                        }
                        // tslint:disable-next-line:only-arrow-functions
                        this.alumnosVotados = this.alumnosVotados.sort(function(a, b) {
                          return b.puntos - a.puntos;
                        }); 
                      }
                    }

                  ]
                });
                await confirm.present();
              });
            } else {
              this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos = [];
              if (this.juegoSeleccionado.ModoReparto !== 'Reparto libre') {
                // Guardo los identificadores de los equipos a los que ha votado (que estan en las primeras posiciones de la lista)
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.juegoSeleccionado.Puntos.length; i++) {
                  this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos.push ({
                    equipoId: this.equipos[i].id,
                    puntos:  this.juegoSeleccionado.Puntos[i]
                  });
                }
              } else {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.equiposConPuntos.length; i++) {
                  this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos.push ({
                    equipoId: this.equiposConPuntos[i].eq.id,
                    puntos:  this.equiposConPuntos[i].puntos
                  });
                }

              }
              // Notifico al server que el alumno ha votado
              this.comServer.Emitir('notificarVotacion', { votacion: this.inscripcionEquipoJuegoDeVotacionUnoATodos});

              this.peticionesAPI.RegistraVotacionEquipo (this.inscripcionEquipoJuegoDeVotacionUnoATodos)
              .subscribe (async () => {
                // tslint:disable-next-line:no-shadowed-variable
                const confirm = await this.alertCtrl.create({
                  header: 'Votación registrada con éxito',
                  buttons: [
                    {
                      text: 'OK',
                      handler: async () => {
                        // Ahora ya he votado. Preparo la lista de los equipos votados

                        this.equiposVotados = [];
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos.length; i++) {
                          // tslint:disable-next-line:max-line-length
                          const equipo = this.equipos.filter (eq => eq.id === this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos[i].equipoId)[0];
                          this.equiposVotados.push ({
                            eq: equipo,
                            puntos: this.inscripcionEquipoJuegoDeVotacionUnoATodos.Votos[i].puntos
                          });
                        }
                        // tslint:disable-next-line:only-arrow-functions
                        this.equiposVotados = this.equiposVotados.sort(function(a, b) {
                          return b.puntos - a.puntos;
                        });
                      }
                    }

                  ]
                });
                await confirm.present();
              });

            }

          }
        }, {
          text: 'NO',
          role: 'cancel',
       
          handler: () => {
          }
        }
      ]
    });
    await confirm.present();

  }

}
