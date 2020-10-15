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
    this.nickName = this.sesion.DameNickName();
  }




   // Esta función se ejecuta cuando movemos a los conceptos de sitio
   reorderItems(event) {
    const itemMove = this.juegoSeleccionado.Conceptos.splice(event.detail.from, 1)[0];
    this.juegoSeleccionado.Conceptos.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
 }

 
 async EnviarVotacion() {
  console.log ('voy a enviar la votacion');
  const misVotos: string[] = [];
  for (let i = 0; i < this.juegoSeleccionado.Puntos.length; i++) {
    misVotos[i] = this.juegoSeleccionado.Conceptos[i];
  }
  console.log (misVotos);
  this.comServer.Emitir ('respuestaVotacionRapida',
    { nick: this.nickName,
      votos: misVotos
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
  this.comServer.DesconectarJuegoRapido();
  this.route.navigateByUrl('/home');
}


}
