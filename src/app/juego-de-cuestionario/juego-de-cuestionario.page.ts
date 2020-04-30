import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController } from '@ionic/angular';
import { CalculosService } from '../servicios/calculos.service';
import { Juego } from '../clases';
import { Cuestionario } from '../clases/Cuestionario';
import { Pregunta } from '../clases/Pregunta';

@Component({
  selector: 'app-juego-de-cuestionario',
  templateUrl: './juego-de-cuestionario.page.html',
  styleUrls: ['./juego-de-cuestionario.page.scss'],
})
export class JuegoDeCuestionarioPage implements OnInit {

  juegoSeleccionado: Juego;
  cuestionario: Cuestionario;
  PreguntasCuestionario: Pregunta[];
  descripcion: string = '';
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  respuestasPosibles: string[] = [];

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      this.cuestionario = res;
      console.log(this.cuestionario)
      this.descripcion = res.Descripcion;
    });
    this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res=>{
      this.PreguntasCuestionario = res;
      this.respuestasPosibles.push(res[0].RespuestaCorrecta);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta1);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta2);
      this.respuestasPosibles.push(res[0].RespuestaIncorrecta3);
      console.log(this.PreguntasCuestionario);
    });

  }

  cambioRespuestasSiguiente(i: number) {
    if ((i+1) != this.PreguntasCuestionario.length){
      this.respuestasPosibles = [];
      i = i + 1;
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaCorrecta);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
      this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
    }
  }

  cambioRespuestasAnterior(i: number) {
    this.respuestasPosibles = [];
    i = i - 1;
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaCorrecta);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
  }

}
