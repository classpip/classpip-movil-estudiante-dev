import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {
  Alumno, Juego, Jornada, TablaJornadas, EnfrentamientoLiga, TablaAlumnoJuegoDeCompeticion,
  TablaEquipoJuegoDeCompeticion, AlumnoJuegoDeCompeticionLiga, TablaClasificacionJornada
} from '../clases/index';
import { SesionService } from '../servicios/sesion.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-informacion-jornadas',
  templateUrl: './informacion-jornadas.page.html',
  styleUrls: ['./informacion-jornadas.page.scss'],
})
export class InformacionJornadasPage implements OnInit {

  juegoSeleccionado: Juego;
  jornadas: Jornada[];
  numeroTotalJornadas: number;
  JornadasCompeticion: TablaJornadas[] = [];
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
  MiAlumno: Alumno;

  EnfrentamientosJornadaSeleccionada: EnfrentamientoLiga[] = [];
  botonResultadosDesactivado: boolean;

  //f1
  tablaf1Jornada: TablaClasificacionJornada[] = [];
  tablaf1Juego: EnfrentamientoLiga[][];
  datosClasificacionJornada: {
    participante: string[];
    puntos: number[];
    posicion: number[];
    participanteId: number[];
  };
  TablaClasificacionJornadaSeleccionada: TablaClasificacionJornada[];
  GanadoresJornadaF1: TablaClasificacionJornada[];

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.MiAlumno = this.sesion.DameAlumno();
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.numeroTotalJornadas = this.juegoSeleccionado.NumeroTotalJornadas;
    const datos = this.sesion.DameDatosJornadas();
    this.JornadasCompeticion = datos.JornadasCompeticion;
    console.log('Jornadas Competicion: ');
    // Teniendo la tabla de Jornadas puedo sacar los enfrentamientos de cada jornada accediendo a la api
    console.log(this.JornadasCompeticion);
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('La lista de alumnos es: ');
    console.log(this.listaAlumnosClasificacion);
  }

  

  // Para Competición Fórmula Uno:
  ObtenerEnfrentamientosDeCadaJornada(jornadaSeleccionada: TablaJornadas) {
    if (this.juegoSeleccionado.Tipo === "Juego De Competición Liga") {
      console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
      this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(jornadaSeleccionada.id)
        .subscribe(enfrentamientos => {
          this.EnfrentamientosJornadaSeleccionada = enfrentamientos;
          console.log('Los enfrentamientos de esta jornada son: ');
          console.log(this.EnfrentamientosJornadaSeleccionada);
          console.log('Ya tengo los enfrentamientos de la jornada, ahora tengo que mostrarlos en una tabla');
          this.ConstruirTablaEnfrentamientos();
        });
    } else {
      console.log('El id de la jornada seleccionada es: ' + jornadaSeleccionada.id);
      if (jornadaSeleccionada.GanadoresFormulaUno === undefined) {
        this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
          this.listaEquiposClasificacion, undefined, undefined);
      } else {
        this.datosClasificacionJornada = this.calculos.ClasificacionJornada(this.juegoSeleccionado, this.listaAlumnosClasificacion,
          this.listaEquiposClasificacion, jornadaSeleccionada.GanadoresFormulaUno.nombre,
          jornadaSeleccionada.GanadoresFormulaUno.id);
      }
      // console.log(this.datosClasificaciónJornada.participante);
      // console.log(this.datosClasificaciónJornada.puntos);
      // console.log(this.datosClasificaciónJornada.posicion);
      this.ConstruirTablaClasificaciónJornada();
    }
  }

  ConstruirTablaClasificaciónJornada() {
    console.log('Aquí tendré la tabla de clasificación, los participantes ordenados son:');
    console.log(this.datosClasificacionJornada.participante);
    console.log(this.datosClasificacionJornada.puntos);
    console.log(this.datosClasificacionJornada.posicion);
    console.log('ParticipanteId:');
    console.log(this.datosClasificacionJornada.participanteId);
    this.TablaClasificacionJornadaSeleccionada = this.calculos.PrepararTablaRankingJornadaFormulaUno(this.datosClasificacionJornada);
    this.GanadoresJornadaF1 = this.TablaClasificacionJornadaSeleccionada.slice(0, 3);
    console.log('los ganadores: ');
    console.log(this.GanadoresJornadaF1);
  }

  DameJornadasDelJuegoDeCompeticionF1() {
    this.peticionesAPI.DameJornadasDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadas);
        console.log('Vamos a por los enfrentamientos de cada jornada');
      });
  }

  // Para Competicion Liga:
  ConstruirTablaEnfrentamientos() {
    console.log ('Aquí tendré la tabla de enfrentamientos, los enfrentamientos sonc:');
    console.log(this.EnfrentamientosJornadaSeleccionada);
    console.log('Distinción entre Individual y equipos');
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientos(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnosClasificacion,
                                                                                            this.listaEquiposClasificacion,
                                                                                            this.juegoSeleccionado);
      
      console.log('La tabla de enfrentamientos individual queda: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

    } else {
      this.EnfrentamientosJornadaSeleccionada = this.calculos.ConstruirTablaEnfrentamientos(this.EnfrentamientosJornadaSeleccionada,
                                                                                            this.listaAlumnosClasificacion,
                                                                                            this.listaEquiposClasificacion,
                                                                                            this.juegoSeleccionado);
      console.log('La tabla de enfrentamientos por equipos queda: ');
      console.log(this.EnfrentamientosJornadaSeleccionada);

    }
  }


  JornadaFinalizada(jornadaSeleccionada: TablaJornadas) {
    const jornadaFinalizada = this.calculos.JornadaFinalizada(this.juegoSeleccionado, jornadaSeleccionada);
    if (jornadaFinalizada === true) {
      this.botonResultadosDesactivado = true;
    } else {
      this.botonResultadosDesactivado = false;
    }
    return jornadaFinalizada;
  }

  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };

}
