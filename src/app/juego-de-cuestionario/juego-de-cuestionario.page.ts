import { Component, OnInit } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { NavController } from '@ionic/angular';
import { CalculosService } from '../servicios/calculos.service';
import { Juego } from '../clases';
import { Cuestionario } from '../clases/Cuestionario';
import { Pregunta } from '../clases/Pregunta';
import { AlumnoJuegoDeCuestionario } from '../clases/AlumnoJuegoDeCuestionario';

@Component({
  selector: 'app-juego-de-cuestionario',
  templateUrl: './juego-de-cuestionario.page.html',
  styleUrls: ['./juego-de-cuestionario.page.scss'],
})
export class JuegoDeCuestionarioPage implements OnInit {

  alumnoId: number;
  alumnoJuegoDeCuestionario: AlumnoJuegoDeCuestionario;
  juegoSeleccionado: Juego;
  cuestionario: Cuestionario;
  PreguntasCuestionario: Pregunta[];
  descripcion: string = '';
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  respuestasPosibles: string[] = [];
  RespuestaEscogida: string;
  RespuestasAlumno: string[] = [];
  Nota: number = 0;

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.alumnoId = this.sesion.DameAlumno().id;
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.puntuacionCorrecta = this.juegoSeleccionado.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.juegoSeleccionado.PuntuacionIncorrecta;
    this.peticionesAPI.DameInscripcionAlumnoJuegoDeCuestionario(this.alumnoId, this.juegoSeleccionado.id)
    .subscribe (res => {
      this.alumnoJuegoDeCuestionario = res;
    });
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
    this.RespuestasAlumno.splice(i, 1, this.RespuestaEscogida);
    if (this.RespuestasAlumno[i+1] !== undefined) {
      this.RespuestaEscogida = this.RespuestasAlumno[i+1];
    } else {
      this.RespuestaEscogida = this.RespuestasAlumno[i];
    }
    
    console.log(this.RespuestasAlumno);
    console.log(this.RespuestasAlumno[i+1]);
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
    this.RespuestaEscogida = this.RespuestasAlumno[i-1];
    this.respuestasPosibles = [];
    i = i - 1;
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaCorrecta);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta1);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta2);
    this.respuestasPosibles.push(this.PreguntasCuestionario[i].RespuestaIncorrecta3);
  }
  guardamosRespuestas(respuesta: string) {
    this.RespuestasAlumno.push(this.RespuestaEscogida);
  }

  ponerNota() {
    for(var i = 0; i < this.PreguntasCuestionario.length; i++) {
      if (this.RespuestasAlumno[i] === this.PreguntasCuestionario[i].RespuestaCorrecta){
        this.Nota = this.Nota + this.puntuacionCorrecta;
      } else {
        this.Nota = this.Nota - this.puntuacionIncorrecta;
      }
    }
    console.log(this.Nota);
    
    this.peticionesAPI.PonerNotaAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario (this.alumnoId, this.juegoSeleccionado.id,
      this.Nota), this.alumnoJuegoDeCuestionario[0].id)
      .subscribe(res => {
        console.log(res);
      });
  }
}
