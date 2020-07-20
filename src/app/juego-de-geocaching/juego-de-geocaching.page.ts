import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { CalculosService } from '../servicios/calculos.service';
import { Juego, AlumnoJuegoDeGeocaching, Escenario, PuntoGeolocalizable, MiAlumnoAMostrarJuegoDeGeocaching } from '../clases';
import { Pregunta } from '../clases/Pregunta';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-juego-de-geocaching',
  templateUrl: './juego-de-geocaching.page.html',
  styleUrls: ['./juego-de-geocaching.page.scss'],
})
export class JuegoDeGeocachingPage implements OnInit {
  @ViewChild('stepper', {static: false}) stepper: MatStepper;

  empezado: boolean = false;
  rendirse: boolean = false;
  alertaproximidad: boolean = false;
  ubicacion: boolean = false;
  respuesta: boolean = false;
  bonus: boolean = false;
  respuestabonus: boolean = false;



  alumnoId: number;
  alumnoJuegoDeGeocaching: AlumnoJuegoDeGeocaching;
  juegoSeleccionado: Juego;
  escenario: Escenario;
  descripcion: string = '';
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  puntuacionCorrectaBonus: number;
  puntuacionIncorrectaBonus: number;
  preguntasBasicas: Pregunta[];
  idpreguntasBasicas: number[];
  preguntasBonus: Pregunta[];
  idpreguntasBonus: number[];
  puntogeolocalizable: PuntoGeolocalizable;
  puntosgeolocalizables: PuntoGeolocalizable[];
  preguntabasica: Pregunta;
  preguntabonus: Pregunta;

  MisAlumnosDelJuegoDeGeocaching: MiAlumnoAMostrarJuegoDeGeocaching[];
  

  puntuaciontotal: number = 0;
  numeroEtapas: number;
  index: number = 0;
  distancia: number = 1000;
  identificador: any;

  coords: any = { lat:0, lng: 0 }

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  respuestasPosiblesBasicas: string[] = [];
  respuestasPosiblesBonus: string[] = [];
  RespuestaEscogidaBasica: string;
  RespuestaEscogidaBonus: string;
  Nota: number = 0;
  PuntuacionInicial: string = '';
 
  //definimos la posición de la respuesta correcta en cada pregunta basica y bonus
  ordenRespuestaCorrectaBasicas: number[] = [3, 1, 1, 0, 2, 0, 3, 3, 2, 0, 2];
  ordenRespuestaCorrectaBonus: number[] = [2, 3, 3, 1, 0, 0, 2, 1, 1, 3, 2];
 
  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private route: Router,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
    private alertCtrl: AlertController,
    private platform: Platform
    // private servidor: Socket
  ) { }

  ngOnInit() {
    this.alumnoId = this.sesion.DameAlumno().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.puntuacionCorrectaBonus = this.juegoSeleccionado.PuntuacionCorrectaBonus;
    this.puntuacionIncorrectaBonus = this.juegoSeleccionado.PuntuacionIncorrectaBonus;
    this.idpreguntasBasicas = this.juegoSeleccionado.PreguntasBasicas;
    this.idpreguntasBonus = this.juegoSeleccionado.PreguntasBonus;
     
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeGeocaching(this.alumnoId, this.juegoSeleccionado.id)
    .subscribe (res => {
      this.alumnoJuegoDeGeocaching = res;
      this.PuntuacionInicial = res[0].Puntuacion.toString();
    });
    this.peticionesAPI.DameEscenario(this.juegoSeleccionado.idescenario)
    .subscribe(res => {
      this.escenario = res;
      this.descripcion = res.Descripcion;
    });

    this.peticionesAPI.DamePuntosGeolocalizablesEscenario(this.juegoSeleccionado.idescenario)
    .subscribe(res => {
      this.puntosgeolocalizables = res.sort(function() {return Math.random() -0.5}); //desorden puntos geolocalizables
      this.puntogeolocalizable=res[this.index];
      this.numeroEtapas = res.length;
 
    });

    this.calculos.DamePreguntasJuegoDeGeocaching(this.idpreguntasBasicas).subscribe(lista => {
      this.preguntasBasicas = lista.sort(function() {return Math.random() -0.5});; //desorden preguntas basicas
      this.preguntabasica = lista[this.index];
      });
 
      this.calculos.DamePreguntasJuegoDeGeocaching(this.idpreguntasBonus).subscribe(lista => {
       this.preguntasBonus = lista.sort(function() {return Math.random() -0.5});; //desorden preguntas bonus
      this.preguntabonus = lista [this.index];
       });

       if (this.juegoSeleccionado.JuegoTerminado) {
        this.MisAlumnosDelJuegoDeGeocaching = this.calculos.DameListaAlumnosJuegoGeocachingOrdenada(this.juegoSeleccionado.id);
      }
      // this.servidor.connect();
 
  }
  
  empezamos() {
    this.empezado = true;

    this.identificador = navigator.geolocation.watchPosition((position) => {
      const lat =  position.coords.latitude;
      const lon =  position.coords.longitude;
      console.log('latitud ' + lat);
      console.log('longitud ' + lon );
      console.log('distancia' + this.distancia)

      if (this.distancia <= 25 && this.alertaproximidad === false) {
        this.caliente();
      }
      if (this.distancia <= 5 && this.ubicacion === false) {
        this.llegada();
      }

      this.distancia = this.calculateDistance(lon, Number(this.puntogeolocalizable.Longitud), lat, Number(this.puntogeolocalizable.Latitud));
}, null, this.options);

}

calculateDistance(lon1, lon2, lat1, lat2){
  let p = 0.017453292519943295;
  let c = Math.cos;
  let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((lon1- lon2) * p))) / 2;
  let dis = (12742 * Math.asin(Math.sqrt(a)))*1000;
  return dis
}

PreguntaBasica(){
    if (this.RespuestaEscogidaBasica === this.preguntabasica.RespuestaCorrecta) {
      console.log('paso por preguntabasica y la acierto');
      this.respuesta = true;
      this.RespuestaCorrecta();
    }
    if (this.RespuestaEscogidaBasica !== this.preguntabasica.RespuestaCorrecta) {
      console.log('paso por pregunta basica y la fallo');
      this.respuesta = false;
      this.bonus = false;
      console.log('respuesta' + this.respuesta);
      console.log('bonus' + this.bonus);
      this.RespuestaIncorrecta();
    }
}
PreguntaBonus(){
  if (this.RespuestaEscogidaBonus === this.preguntabonus.RespuestaCorrecta) {
    console.log('paso por bonus y la acierto');
    this.respuestabonus = true;
    this.RespuestaCorrectaBonus();
  }
  else {
    console.log('paso por bonus y la fallo')
    this.respuestabonus = false;
    this.RespuestaIncorrectaBonus();
  }
}

preparacionpreguntas(){
    this.respuestasPosiblesBasicas.push(this.preguntasBasicas[this.index].RespuestaIncorrecta1);
    this.respuestasPosiblesBasicas.push(this.preguntasBasicas[this.index].RespuestaIncorrecta2);
    this.respuestasPosiblesBasicas.push(this.preguntasBasicas[this.index].RespuestaIncorrecta3);
    this.respuestasPosiblesBasicas.splice(this.ordenRespuestaCorrectaBasicas[this.index], 0, this.preguntasBasicas[this.index].RespuestaCorrecta);

    this.respuestasPosiblesBonus.push(this.preguntasBonus[this.index].RespuestaIncorrecta1);
    this.respuestasPosiblesBonus.push(this.preguntasBonus[this.index].RespuestaIncorrecta2);
    this.respuestasPosiblesBonus.push(this.preguntasBonus[this.index].RespuestaIncorrecta3);
    this.respuestasPosiblesBonus.splice(this.ordenRespuestaCorrectaBonus[this.index], 0, this.preguntasBonus[this.index].RespuestaCorrecta);
}

Puntuacion(){
  if (this.respuesta === false) {
    //ha fallado la pregunta
    this.Nota = this.puntuacionIncorrecta*(-1);
  }
  if (this.respuesta === true) {
    //acierta pregunta
    this.Nota = this.puntuacionCorrecta;
    if (this.rendirse === true) {
      //se ha rendido
      this.Nota = 0.8*this.Nota;
    }
    if (this.bonus === true){
      //si realiza el bonus:
      if (this.respuestabonus === true){
        //acierta pregunta bonus
        this.Nota = this.Nota + (this.Nota*this.puntuacionCorrectaBonus*0.01);
      }
      if (this.respuestabonus === false) {
        //falla pregunta bonus
        this.Nota = this.Nota - (this.Nota*this.puntuacionIncorrectaBonus*0.01);
      }
    }
  }
  this.puntuaciontotal = this.puntuaciontotal + this.Nota;
  this.peticionesAPI.PonerNotaAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching (this.alumnoId, this.juegoSeleccionado.id,this.puntuaciontotal, this.index+1), this.alumnoJuegoDeGeocaching[0].id)
    .subscribe(res => {
      console.log(res);
    });
}

siguiente(){
  //reset de todas las variables
  this.rendirse=false;
  this.distancia=1000;
  this.alertaproximidad=false;
  this.ubicacion=false;
  this.respuestasPosiblesBasicas=[];
  this.respuestasPosiblesBonus=[];
  this.respuesta=false;
  this.bonus=false;
  this.respuestabonus=false;
  this.Nota=0;
  this.index=this.index + 1;
  this.puntogeolocalizable=this.puntosgeolocalizables[this.index];
  this.preguntabasica=this.preguntasBasicas[this.index];
  this.preguntabonus=this.preguntasBonus[this.index];
  this.mover(2); //volvemos al TERCER PASO
  this.empezamos();
  // this.servidor.emit('etapaJuegoDeGeocaching', { id: this.alumnoId, puntuacion: this.puntuaciontotal, etapa: this.index});
}

finalizar(){
  this.route.navigateByUrl('tabs/inici');
}

mover(a: number){
  this.stepper.selectedIndex = a;
}





// ALERTAS

async popup() {
  const confirm = await this.alertCtrl.create({
    header: '¿Seguro que quieres salir?',
    message: 'Si sales tu puntuación será de 0',
    buttons: [
      {
        text: 'SI',
        handler: () => {
          this.Nota = 0.1;
          // tslint:disable-next-line:max-line-length
          this.peticionesAPI.PonerNotaAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching (this.alumnoId, this.juegoSeleccionado.id,this.Nota, this.numeroEtapas), this.alumnoJuegoDeGeocaching[0].id)
            .subscribe(res => {
              console.log(res);
            });
         this.finalizar();
        }
      }, {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          console.log('NO, ME QUEDO');
        }
      }
    ]
  });
  await confirm.present();
}

async Rendirse() {
  const confirm = await this.alertCtrl.create({
    header: '¿Seguro que quieres rendirte?',
    message: 'Vas a perder un 20% del valor de la puntuación correcta',
    buttons: [
      {
        text: 'SI',
        handler: () => {
          this.rendirse=true;
        }
      }, {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          this.rendirse=false;
        }
      }
    ]
  });
  await confirm.present();
}


async caliente() {
  const confirm = await this.alertCtrl.create({
    header: 'CALIENTE,CALIENTE...',
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.alertaproximidad=true;
          console.log('alerta mensaje caliente caliente');
        }
      }
    ]
  });
  await confirm.present();
}

async llegada() {
  const confirm = await this.alertCtrl.create({
    header: '¡HAS LLEGADO!',
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.ubicacion=true;
          console.log('llegada' + this.ubicacion);
          navigator.geolocation.clearWatch (this.identificador);
          this.preparacionpreguntas();
          console.log('llegada al punto');
          console.log('clearwatch');

        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaCorrecta() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA CORRECTA',
    message: '¿Quieres responder la pregunta Bonus?',
    buttons: [
      {
        text: 'SI',
        handler: () => {
          this.bonus=true;
          console.log('hay bonus');
          
        }
      }, {
        text: 'NO',
        role: 'cancel',
        handler: () => {
          this.bonus=false;
          console.log('no hay bonus');
          this.Puntuacion();
        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaIncorrecta() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA INCORRECTA',
    message: this.preguntasBasicas[this.index].FeedbackIncorrecto,
    buttons: [
        {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.bonus=false;
          console.log('error en la pregunta, no hay bonus');
          this.Puntuacion();
        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaCorrectaBonus() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA BONUS CORRECTA',
    message: this.preguntasBonus[this.index].FeedbackCorrecto,
    buttons: [
      {
        text: 'OK',
        handler: () => {
          console.log('pregunta bonus correcta');
          this.Puntuacion();
        }
      }
    ]
  });
  await confirm.present();
}

async RespuestaIncorrectaBonus() {
  const confirm = await this.alertCtrl.create({
    header: 'RESPUESTA BONUS INCORRECTA',
    message: this.preguntasBonus[this.index].FeedbackIncorrecto,
    buttons: [
      {
        text: 'OK',
        handler: () => {
          console.log('pregunta bonus incorrecta');
          this.Puntuacion();
        }
      }
    ]
  });
  await confirm.present();
}

}
