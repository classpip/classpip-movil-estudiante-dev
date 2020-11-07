import { Component, OnInit , ViewChild} from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-juego-coger-turno-rapido',
  templateUrl: './juego-coger-turno-rapido.page.html',
  styleUrls: ['./juego-coger-turno-rapido.page.scss'],
})
export class JuegoCogerTurnoRapidoPage implements OnInit {
  
  juegoSeleccionado: any;
  nickName: string;
  listaOpciones: any [];



  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private comServer: ComServerService,
    private route: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.listaOpciones = this.juegoSeleccionado.Turnos.filter (opcion => opcion.persona === undefined && opcion.dia !== '*');
    // esta es la opción para indicar que ningun turno me va bien
    this.listaOpciones.push ( {
      persona: undefined,
      dia: '*',
      hora: '*'
    });
    // tslint:disable-next-line:only-arrow-functions
    this.listaOpciones = this.listaOpciones.sort(function(a, b) {
        if (a.dia < b.dia) {
          return -1;
        } else if (a.dia > b.dia) {
          return 1;
        } else if (a.hora < b.hora) {
          return -1;
        } else if ( a.hora > b.hora) {
          return 1;
        } else {
          return 0;
        }
    });

    console.log ('ya tengo la liusta de opciones');
    console.log (this.listaOpciones);
    this.nickName = this.sesion.DameNickName();
    this.comServer.EsperoTurnosCogidos()
    .subscribe((turno) => {
      this.listaOpciones = this.listaOpciones.filter (opcion => (opcion.dia !== turno.dia) || (opcion.hora !== turno.hora));
    });
    this.comServer.EsperoTurnosNuevos()
    .subscribe((turno) => {
      this.listaOpciones.push (turno);
      // tslint:disable-next-line:only-arrow-functions
      this.listaOpciones = this.listaOpciones.sort(function(a, b) {
        if (a.dia < b.dia) {
          return -1;
        } else if (a.dia > b.dia) {
          return 1;
        } else if (a.hora < b.hora) {
          return -1;
        } else if ( a.hora > b.hora) {
          return 1;
        } else {
          return 0;
        }
    });

    });

  }

  async EnviarTurnoElegido(turnoElegido) {
    if (turnoElegido.dia !== '*') {
      const dia = this.datePipe.transform(turnoElegido.dia, 'dd-MM-yyyy');
      const confirm = await this.alertCtrl.create({
          header: '¿Seguro que quieres elegir este turno?',
          message: '<strong>dia:  </strong>' + dia + '<br><strong>hora: </strong> ' + turnoElegido.hora,
          buttons: [
                    {
                      text: 'OK',
                      handler: async () => {
                        this.comServer.Emitir ('turnoElegido',
                          { nick: this.nickName,
                            turno: turnoElegido,
                            clave: this.juegoSeleccionado.Clave
                          }
                        );
                        const confirm2 = await this.alertCtrl.create({
                          header: 'Turno elegido enviado',
                          message: 'Gracias por participar',
                          buttons: [
                                      {
                                        text: 'OK',
                                        role: 'cancel',
                                        handler: () => {
                                          this.comServer.DesconectarJuegoCogerTurnoRapido(this.juegoSeleccionado.Clave);
                                          this.route.navigateByUrl('/home');
                                        }
                                      }
                                    ]
                          });
                        await confirm2.present();
                      }
                    }, {
                    text: 'Cancelar'
                    }
                  ]
      });
      await confirm.present();
    } else {
      const confirm = await this.alertCtrl.create({
        header: '¿Seguro que ningún turno te va bien?',
         buttons: [
                  {
                    text: 'OK',
                    handler: async () => {
                      this.comServer.Emitir ('turnoElegido',
                        { nick: this.nickName,
                          turno: turnoElegido,
                          clave: this.juegoSeleccionado.Clave
                        }
                      );
                      const confirm2 = await this.alertCtrl.create({
                        header: 'Información enviada correctamente',
                        message: 'Gracias por participar',
                        buttons: [
                                    {
                                      text: 'OK',
                                      role: 'cancel',
                                      handler: () => {
                                        this.comServer.DesconectarJuegoCogerTurnoRapido(this.juegoSeleccionado.Clave);
                                        this.route.navigateByUrl('/home');
                                      }
                                    }
                                  ]
                        });
                      await confirm2.present();
                    }
                  }, {
                  text: 'Cancelar'
                  }
                ]
      });
      await confirm.present();
    }

}


}
