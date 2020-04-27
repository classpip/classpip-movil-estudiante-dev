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
  preguntas: Pregunta[];

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.peticionesAPI.DameCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res => {
      this.cuestionario = res;
      console.log(this.cuestionario)
    });
    this.peticionesAPI.DamePreguntasCuestionario(this.juegoSeleccionado.cuestionarioId)
    .subscribe(res=>{
      this.preguntas = res;
      console.log(this.preguntas);
    });

  }

}
