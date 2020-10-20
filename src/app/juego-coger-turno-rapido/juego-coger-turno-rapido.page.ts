import { Component, OnInit , ViewChild} from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-juego-coger-turno-rapido',
  templateUrl: './juego-coger-turno-rapido.page.html',
  styleUrls: ['./juego-coger-turno-rapido.page.scss'],
})
export class JuegoCogerTurnoRapidoPage implements OnInit {
  
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

  EnviarTurnoElegido(turno) {
    console.log ('voy a enviar el turno');
    console.log (turno);
  }


}
