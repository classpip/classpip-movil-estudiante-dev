import { Component, OnInit , ViewChild} from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Alumno, AlumnoJuegoDeVotacionAOpciones } from '../clases';

@Component({
  selector: 'app-juego-votacion-aopciones',
  templateUrl: './juego-votacion-aopciones.page.html',
  styleUrls: ['./juego-votacion-aopciones.page.scss'],
})
export class JuegoVotacionAOpcionesPage implements OnInit {

  juegoSeleccionado: any;
  nickName: string;
  opcionesConPuntos: any[];
  misVotos: any[];
  puntosARepartir: number;
  haVotado = false;
  alumno: Alumno;
  alumnoJuegoDeVotacionAOpciones: AlumnoJuegoDeVotacionAOpciones;


  

  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private comServer: ComServerService,
    private route: Router,
  ) { }
 
  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntosARepartir = this.juegoSeleccionado.Puntos[0];
    // Solo puede ser juego individual
    this.alumno = this.sesion.DameAlumno();
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeVotacionAOpciones (this.juegoSeleccionado.id, this.alumno.id)
    .subscribe( inscripcion => {
      this.alumnoJuegoDeVotacionAOpciones = inscripcion[0];
      if (this.alumnoJuegoDeVotacionAOpciones.Votos) {
        this.haVotado = true;
        this.misVotos = this.alumnoJuegoDeVotacionAOpciones.Votos;
        this.misVotos = this.misVotos.sort(function(a, b) {
          return b.puntos - a.puntos;
        });
      }

    });

    if (this.juegoSeleccionado.ModoReparto === 'Reparto libre') {
      this.opcionesConPuntos = [];
      this.juegoSeleccionado.Opciones.forEach (op =>
        this.opcionesConPuntos.push ({
          opcion: op,
          puntos: 0
        })
      );
    }
  }




   // Esta función se ejecuta cuando movemos a los conceptos de sitio
   reorderItems(event) {
    const itemMove = this.juegoSeleccionado.Opciones.splice(event.detail.from, 1)[0];
    this.juegoSeleccionado.Opciones.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
 }

 Incrementar(i) {
  if (this.puntosARepartir > 0) {
    this.opcionesConPuntos[i].puntos++;
    this.puntosARepartir--;
  }
}
Decrementar(i) {
  if ( this.opcionesConPuntos[i].puntos > 0) {
    this.opcionesConPuntos[i].puntos--;
    this.puntosARepartir++;
  }
}
EnviarVotacion () {
  console.log ('voy a enviar la votacion del juego');
  console.log (this.juegoSeleccionado);
  this.misVotos = [];
  if (this.juegoSeleccionado.ModoReparto !== 'Reparto libre') {
    console.log ('AAAAA');
    for (let i = 0; i < this.juegoSeleccionado.Puntos.length; i++) {
      this.misVotos.push ({
        opcion: this.juegoSeleccionado.Opciones[i],
        puntos: this.juegoSeleccionado.Puntos[i]
      });
    }
  } else {
    this.misVotos = this.opcionesConPuntos;
  }

  console.log ('Mi votacion');
  console.log (this.misVotos);
  this.alumnoJuegoDeVotacionAOpciones.Votos = this.misVotos;
  
  this.peticionesAPI.RegistraVotacionAOpciones (this.alumnoJuegoDeVotacionAOpciones)
  .subscribe (async () => {

    this.comServer.Emitir ('respuestaVotacionAOpciones',
      { alumnoId: this.alumno.id,
        votos: this.misVotos
      }
    );
    const confirm = await this.alertCtrl.create({
      header: 'Votaciones registradas con éxito',
      buttons: [
        {
          text: 'OK',
          handler: async () => {
            this.haVotado = true;
            this.misVotos = this.misVotos.sort(function(a, b) {
                  return b.puntos - a.puntos;
            });
          }
        }

      ]
    });
    await confirm.present();
  });

}

//   this.comServer.Emitir ('respuestaVotacionRapida',
//     { nick: this.nickName,
//       votos: this.misVotos
//     }
//   );
//   const confirm = await this.alertCtrl.create({
//     header: 'Votacion enviada con éxito',
//     message: 'Gracias por participar',
//     buttons: [
//         {
//         text: 'OK',
//         role: 'cancel',
//         handler: () => {
//         }
//       }
//     ]
//   });
//   await confirm.present();
//   // tslint:disable-next-line:only-arrow-functions
//   this.misVotos = this.misVotos.sort(function(a, b) {
//     return b.puntos - a.puntos;
//   });
//   this.haVotado = true;

//   // Ahora voy a guardar la votación en el juego para que no se pierde si el dash no
//   // está ahora esperando votaciones.
//   // Pero primero tengo que traer de nuevo el juego por si ha habido otras votaciones 
//   // desde que lo traje al inicio
//   this.peticionesAPI.DameJuegoDeVotacionRapida (this.juegoSeleccionado.Clave)
//   .subscribe (juego => {
//     juego[0].Respuestas.push (
//       { nick: this.nickName,
//       votos: this.misVotos
//     });
//     this.peticionesAPI.ModificarJuegoVotacionRapida (juego[0]).subscribe();
//   });
// }

Cerrar() {
  this.route.navigateByUrl('/inici');
}



}
