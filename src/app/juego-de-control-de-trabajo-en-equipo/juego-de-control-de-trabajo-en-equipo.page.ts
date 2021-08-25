import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Alumno, AlumnoJuegoDeControlDeTrabajoEnEquipo, Equipo } from '../clases';
import { SesionService, PeticionesAPIService, ComServerService } from '../servicios';

@Component({
  selector: 'app-juego-de-control-de-trabajo-en-equipo',
  templateUrl: './juego-de-control-de-trabajo-en-equipo.page.html',
  styleUrls: ['./juego-de-control-de-trabajo-en-equipo.page.scss'],
})
export class JuegoDeControlDeTrabajoEnEquipoPage implements OnInit {

  alumno: Alumno;
  juegoSeleccionado: any;
  alumnosEquipo: any;
  inscripcionAlumno: AlumnoJuegoDeControlDeTrabajoEnEquipo;
  equipo: Equipo;
  numeroDeControl: number;
  mostrarFormulario = false;
  mostrarPuntuaciones = false;
  mostrarControles = true;
  puntosARepartir: number;
  puntos: number[];
  comentario: string;
  numeroControlesRealizados: number;
  controlesRestantes: number;
  resultado;
  nombresAlumnos;
  respuestasEquipo: any[];
  puntosEquipo: number[];
  comentariosEquipo: string[];
  controlCompleto = false;


  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private comServer: ComServerService
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();


    this.alumno = this.sesion.DameAlumno();
  

    // Traigo la inscripción del alumno
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeControlDeTrabajoEnEquipo(this.juegoSeleccionado.id, this.alumno.id)
    .subscribe (inscripcion => {
      this.inscripcionAlumno = inscripcion[0];
      // En el campo respuestas de la inscripción hay un vector con una posición por cada control realizado
      if (!this.inscripcionAlumno.respuestas) {
        this.numeroControlesRealizados = 0;
      } else {
        this.numeroControlesRealizados = this.inscripcionAlumno.respuestas.length;
      }
      // Controles restantes SIN contar el que va a contestar ahora
      this.controlesRestantes =  this.juegoSeleccionado.numeroDeControles - this.numeroControlesRealizados-1;
    });
    this.peticionesAPI.DameEquipoDeAlumno (this.juegoSeleccionado.grupoId, this.alumno.id)
    .subscribe (equipo => {
      this.equipo = equipo[0];
      this.peticionesAPI.DameAlumnosEquipo (this.equipo.id)
      .subscribe (alumnosEquipo => {
        this.alumnosEquipo = alumnosEquipo;
        // ahora me traigo las inscripciones de todos ellos para quedarme con las respuestas
        this.respuestasEquipo = [];
        this.alumnosEquipo.forEach (alumno => {
          this.peticionesAPI.DameInscripcionAlumnoJuegoDeControlDeTrabajoEnEquipo(this.juegoSeleccionado.id, alumno.id)
          .subscribe (inscripcion => {
            this.respuestasEquipo.push(inscripcion[0].respuestas);
          })
        })
      })
    })
   
  }
  MostrarFormulario (i: number) {
    this.numeroDeControl = i + 1;
    this.mostrarControles = false;
    this.mostrarFormulario = true;
    this.puntosARepartir = 10;
    this.puntos = Array (this.alumnosEquipo.length).fill (0);
  }

  
  Incrementar(i) {
    if (this.puntosARepartir > 0) {
      this.puntos[i]++;
      this.puntosARepartir--;
    }
  }

  Decrementar(i) {
    if ( this.puntos[i] > 0) {
      this.puntos[i]--;
      this.puntosARepartir++;
    }
  }


  // función para enviar las puntuaciones. Es async porque usa una alarma
  async Enviar() {
    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres enviar tus puntuaciones?',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            /* El resultado del control es un objeto con dos campos: puntuaciones y comentario
               Puntuaciones es un vector con tantas posiciones como alumnos tiene el grupo. En cada posición hay el id del alumno 
               y los puntos que se le han asignado.
            */
          
            let misPuntuaciones = [];
            for (let i = 0; i < this.alumnosEquipo.length; i++) {
              misPuntuaciones.push ( {
                id: this.alumnosEquipo[i].id,
                puntos: this.puntos[i],
              })
            };
            let resultado = {
              puntuaciones: misPuntuaciones,
              comentario: this.comentario  
            }
            if (!this.inscripcionAlumno.respuestas) {
              this.inscripcionAlumno.respuestas = [];
            }
            // Añado el resultado de este control a las respuestas de este alumno
            this.inscripcionAlumno.respuestas.push (resultado);

            this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeControlDeTrabajoEnEquipo (this.inscripcionAlumno)
            .subscribe (async () => {
             
              // tslint:disable-next-line:no-shadowed-variable
              const confirm = await this.alertCtrl.create({
                header: 'Puntuaciones registradas con éxito',
                buttons: [
                  {
                    text: 'OK',
                    handler: async () => {
                      this.numeroControlesRealizados++;
                      this.controlesRestantes--;
                      this.mostrarFormulario = false;
                      this.mostrarControles = true;
                      this.comentario = undefined;
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

  VerPuntuaciones (i: number) {
    this.numeroDeControl = i+1;
    // recojo la respuesta al cuestionario i
    this.resultado = this.inscripcionAlumno.respuestas[i];
    this.nombresAlumnos = [];
    // Preparo los nombres de los alumnos
    this.resultado.puntuaciones.forEach (puntuacion => {
      this.nombresAlumnos.push (this.alumnosEquipo.find (alumno => alumno.id === puntuacion.id))
    })


    if (this.juegoSeleccionado.verRespuestasControl) {
      // El alumno solo puede ver los resultados acumulados si se ha configurado así el juego
      // vamos a ver ahora si todos los miembros del equipo han contestado el control para mostrar el
      // total acumulado
   
      this.puntosEquipo = Array(this.alumnosEquipo.length).fill (0);
      this.comentariosEquipo = [];
      this.controlCompleto = true;
      this.respuestasEquipo.forEach (respuestas => {
        if ((!respuestas) || (respuestas.length <= i)) {
          // No han contestado todos
          this.controlCompleto = false;
        } else {
          this.comentariosEquipo.push (respuestas[i].comentario)
          // Acumulo los puntos que ha recibido cada alumno en este control
          // Estoy asumiendo que todas las puntuaciones están guardadas en el mismo orden,
          // es decir, que los puntos del alumno j siempre están en la posición j de todos los
          // vectores de respuestas.
          // Por eso ignoro el id de los alumnos que hay en las puntuaciones. 
          // No debería haber problema porque siempre se guardan los datos en el mismo orden
          for (let j = 0; j < this.puntosEquipo.length; j++) {
            this.puntosEquipo[j] = this.puntosEquipo[j] + respuestas[i].puntuaciones[j].puntos;
          }
        }
      })
    }

    this.comentario = this.resultado.comentario;
    this.mostrarControles = false;
    this.mostrarPuntuaciones = true;
  }

  async Volver () {
    if ((this.mostrarFormulario) && (this.puntosARepartir === 0)) {
      const confirm = await this.alertCtrl.create({
        header: '¿Seguro que quieres volver SIN enviar tus puntuaciones?',
        buttons: [
          {
            text: 'SI',
            handler: async () => {
              this.mostrarFormulario = false;
              this.mostrarPuntuaciones = false;
              this.mostrarControles = true;
              this.comentario = undefined;
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

    } else {
      this.mostrarFormulario = false;
      this.mostrarPuntuaciones = false;
      this.mostrarControles = true;
      this.comentario = undefined;
    }
  }

}
