import { Component, OnInit , ViewChild} from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-juego-votacion-rapida',
  templateUrl: './juego-votacion-rapida.page.html',
  styleUrls: ['./juego-votacion-rapida.page.scss'],
})
export class JuegoVotacionRapidaPage implements OnInit {


  juegoSeleccionado: any;
  nickName: string;
  conceptosConPuntos: any[];
  misVotos: any[];
  puntosARepartir: number;
  haVotado = false;


  

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
    this.nickName = this.sesion.DameNickName();
    if (this.juegoSeleccionado.ModoReparto === 'Reparto libre') {
      this.conceptosConPuntos = [];
      this.juegoSeleccionado.Conceptos.forEach (concepto =>
        this.conceptosConPuntos.push ({
          c: concepto,
          puntos: 0
        })
      );
    }
  }




   // Esta función se ejecuta cuando movemos a los conceptos de sitio
   reorderItems(event) {
    const itemMove = this.juegoSeleccionado.Conceptos.splice(event.detail.from, 1)[0];
    this.juegoSeleccionado.Conceptos.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
 }

 Incrementar(i) {
  if (this.puntosARepartir > 0) {
    this.conceptosConPuntos[i].puntos++;
    this.puntosARepartir--;
  }
}
Decrementar(i) {
  if ( this.conceptosConPuntos[i].puntos > 0) {
    this.conceptosConPuntos[i].puntos--;
    this.puntosARepartir++;
  }
}

 
 async EnviarVotacion() {
  console.log ('voy a enviar la votacion');
  this.misVotos = [];
  if (this.juegoSeleccionado.ModoReparto !== 'Reparto libre') {
    for (let i = 0; i < this.juegoSeleccionado.Puntos.length; i++) {
      this.misVotos.push ({
        c: this.juegoSeleccionado.Conceptos[i],
        puntos: this.juegoSeleccionado.Puntos[i]
      });
    }
  } else {
    this.misVotos = this.conceptosConPuntos;
  }

  this.comServer.Emitir ('respuestaVotacionRapida',
    { nick: this.nickName,
      votos: this.misVotos
    }
  );
  const confirm = await this.alertCtrl.create({
    header: 'Votacion enviada con éxito',
    message: 'Gracias por participar',
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {
        }
      }
    ]
  });
  await confirm.present();
  // tslint:disable-next-line:only-arrow-functions
  this.misVotos = this.misVotos.sort(function(a, b) {
    return b.puntos - a.puntos;
  });
  this.haVotado = true;

  // Ahora voy a guardar la votación en el juego para que no se pierde si el dash no
  // está ahora esperando votaciones.
  // Pero primero tengo que traer de nuevo el juego por si ha habido otras votaciones 
  // desde que lo traje al inicio
  this.peticionesAPI.DameJuegoDeVotacionRapida (this.juegoSeleccionado.Clave)
  .subscribe (juego => {
    juego[0].Respuestas.push (
      { nick: this.nickName,
      votos: this.misVotos
    });
    this.peticionesAPI.ModificarJuegoVotacionRapida (juego[0]).subscribe();
  });
}

Cerrar() {
  this.comServer.DesconectarJuegoRapido();
  this.route.navigateByUrl('/home');
}


}
