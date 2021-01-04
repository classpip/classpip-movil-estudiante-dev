import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController } from '@ionic/angular';
import { JuegoDeVotacionUnoATodos, Alumno, AlumnoJuegoDeVotacionUnoATodos } from '../clases';


@Component({
  selector: 'app-juego-votacion-uno-atodos',
  templateUrl: './juego-votacion-uno-atodos.page.html',
  styleUrls: ['./juego-votacion-uno-atodos.page.scss'],
})
export class JuegoVotacionUnoATodosPage implements OnInit {
  juegoSeleccionado: any;
  alumno: Alumno;
  inscripcionAlumnoJuegoDeVotacionUnoATodos: AlumnoJuegoDeVotacionUnoATodos;
  alumnos: Alumno[];
  alumnosVotados: any[];
  puntos = 50;
  alumnosConPuntos: any[];
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
    this.puntosARepartir = this.juegoSeleccionado.Puntos[0]
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
       // De momento no hay juego de votación por equipos
     }
  }

  // Esta función se ejecuta cuando movemos a los alumnos de posición en la lista
  reorderItems(event) {
     const itemMove = this.alumnos.splice(event.detail.from, 1)[0];
     this.alumnos.splice(event.detail.to, 0, itemMove);
     event.detail.complete();
  }

  Incrementar(i) {
    if (this.puntosARepartir > 0) {
      this.alumnosConPuntos[i].puntos++;
      this.puntosARepartir--;
    }
  }
  Decrementar(i) {
    if ( this.alumnosConPuntos[i].puntos > 0) {
      this.alumnosConPuntos[i].puntos--;
      this.puntosARepartir++;
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
