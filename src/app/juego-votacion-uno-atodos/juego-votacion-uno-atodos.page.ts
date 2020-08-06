import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { NavController, IonContent, AlertController } from '@ionic/angular';
import { JuegoDeVotacionUnoATodos, Alumno, AlumnoJuegoDeVotacionUnoATodos } from '../clases';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-juego-votacion-uno-atodos',
  templateUrl: './juego-votacion-uno-atodos.page.html',
  styleUrls: ['./juego-votacion-uno-atodos.page.scss'],
})
export class JuegoVotacionUnoATodosPage implements OnInit {
  juegoSeleccionado: JuegoDeVotacionUnoATodos;
  alumno: Alumno;
  inscripcionAlumnoJuegoDeVotacionUnoATodos: AlumnoJuegoDeVotacionUnoATodos;
  alumnos: Alumno[];
  alumnosVotados: Alumno[];

  constructor(
    private calculos: CalculosService,
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private servidor: Socket
  ) { }

  ngOnInit() {
    this.servidor.connect();
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.alumno = this.sesion.DameAlumno();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeVotacionUnoATodos(this.juegoSeleccionado.id, this.alumno.id)
      .subscribe (inscripcion => {
        console.log ('tengo la inscripcion');
        // Traigo la inscripción del alumno
        this.inscripcionAlumnoJuegoDeVotacionUnoATodos = inscripcion[0];
        console.log (this.inscripcionAlumnoJuegoDeVotacionUnoATodos);
        // traigo los alumnos del juego
        this.peticionesAPI.DameAlumnosJuegoDeVotacionUnoATodos (this.juegoSeleccionado.id)
        .subscribe (alumnos => {
          console.log ('tengo los alumnos');
          if (!this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos) {
            // aun no ha votado
            this.alumnos = alumnos;
          } else {
            // Si ha votado preparlo la lista solo con los alumnos a los que ha votado
            // para mostrar el resultado de su votación
            this.alumnosVotados = [];
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos.length; i++) {
              const alumno = alumnos.filter (al => al.id === this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i])[0];
              this.alumnosVotados.push (alumno);
            }
          }
          console.log (this.alumnos);
        });

      });
     } else {
       // De momento no hay avatar de equipo
     }
  }

   reorderItems(event) {
     console.log(event);
     console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
     const itemMove = this.alumnos.splice(event.detail.from, 1)[0];
     console.log(itemMove);
     this.alumnos.splice(event.detail.to, 0, itemMove);
     event.detail.complete();
   }

   async Enviar() {

    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres enviar tu votación?',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos = [];
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.juegoSeleccionado.Puntos.length; i++) {
              this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i] = this.alumnos[i].id;
            }
            // Notifico al server que se ha modificado un avatar
            console.log ('voy a notificar');
            this.servidor.emit('notificarVotacion', { votacion: this.inscripcionAlumnoJuegoDeVotacionUnoATodos});

            this.peticionesAPI.RegistraVotacion (this.inscripcionAlumnoJuegoDeVotacionUnoATodos)
            .subscribe (async () => {
              // tslint:disable-next-line:no-shadowed-variable
              const confirm = await this.alertCtrl.create({
                header: 'Votación registrada con éxito',
                buttons: [
                  {
                    text: 'OK',
                    handler: async () => {
                      this.alumnosVotados = [];
                      // tslint:disable-next-line:prefer-for-of
                      for (let i = 0; i < this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos.length; i++) {
                        const alumno = this.alumnos.filter (al => al.id === this.inscripcionAlumnoJuegoDeVotacionUnoATodos.Votos[i])[0];
                        this.alumnosVotados.push (alumno);
                      }
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
