import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { IonContent, NavController } from '@ionic/angular';
// Clases
import {
  Juego, Alumno, Equipo, AlumnoJuegoDeCompeticionFormulaUno, Jornada, TablaJornadas,
  EquipoJuegoDeCompeticionFormulaUno, TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion
} from '../clases/index';

import { Chart } from 'chart.js';

// Servicio
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { SesionService } from '../servicios/sesion.service';

@Component({
  selector: 'app-juego-competicion-f1',
  templateUrl: './juego-competicion-f1.page.html',
  styleUrls: ['./juego-competicion-f1.page.scss'],
})
export class JuegoCompeticionF1Page implements OnInit {

  // Juego De Competicion Formula Uno seleccionado
  juegoSeleccionado: Juego;

  // Recupera la informacion del juego, los alumnos o los equipos
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];

  MiAlumno: Alumno;
  MiEquipo: Equipo;
  posicionDeMiEquipo: number;

  alumnosEquipo: Alumno[];

  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionFormulaUno[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionFormulaUno[];

  rankingIndividualFormulaUno: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposFormulaUno: TablaEquipoJuegoDeCompeticion[] = [];

  infomialumno: TablaAlumnoJuegoDeCompeticion;

  jornadas: Jornada[];
  JornadasCompeticion: TablaJornadas[];


  @ViewChild('barChart', { static: false }) barChart: ElementRef;
  bars: any;
  colorArray: any;

  public hideMe: boolean = false;


  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }


  @ViewChild('content', { static: false }) content: IonContent;

  ngOnInit() {
    this.MiAlumno = this.sesion.DameAlumno();
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
    // this.DameJornadasDelJuegoDeCompeticionSeleccionado();
  }

  datatochart() {
    const labels: string[] = [];
    const datos: number[] = [];
    for (let i = 0; i < this.jornadas.length; i++) {
      labels.push("J" + (i + 1));
      if (this.jornadas[i].GanadoresFormulaUno !== undefined) {
        // La jornada se ha disputado
        // miramos si el jugador esta entre los que han puntuado
        let pos;
        if (this.juegoSeleccionado.Modo === 'Individual') {
          pos = this.jornadas[i].GanadoresFormulaUno.indexOf (this.MiAlumno.id);
        } else {
           pos = this.jornadas[i].GanadoresFormulaUno.indexOf (this.MiEquipo.id);
        }
        if (pos !== -1) {
            // si esta. Guardamos los puntos que sacó en esa jorada.
            datos.push(this.juegoSeleccionado.Puntos[pos]);
        } else {
          datos.push(0);
        }
      }
      console.log(datos);
    }
    this.createBarChart(labels, datos);
  }

  createBarChart(labels, datos) {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Puntos por jornada',
          data: datos,
          backgroundColor: 'transparent',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }


  // Recuperamos las jornadas para poder mandarlas a otras paginas
  DameJornadasDelJuegoDeCompeticionSeleccionado() {
    this.peticionesAPI.DameJornadasDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadas = inscripciones;
        this.datatochart();
      });
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
        this.DameJornadasDelJuegoDeCompeticionSeleccionado();
      });
  }

  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.peticionesAPI.DameEquiposJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(equiposJuego => {
        this.equiposDelJuego = equiposJuego;
        this.RecuperarInscripcionesEquiposJuego();
        this.DameEquipoAlumnoConectado();
        this.DameJornadasDelJuegoDeCompeticionSeleccionado();
      });
  }

  DameEquipoAlumnoConectado() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.equiposDelJuego.length; i++) {
      this.peticionesAPI.DameAlumnosEquipo(this.equiposDelJuego[i].id)
        .subscribe(res => {
          console.log('miro en: ' + this.equiposDelJuego[i]);
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < res.length; j++) {
            if (res[j].id === this.MiAlumno.id) {
              console.log(res);
              this.MiEquipo = this.equiposDelJuego[i];
              console.log('tu equipo');
              console.log(this.MiEquipo);
              // tslint:disable-next-line:max-line-length
              this.posicionDeMiEquipo = this.listaEquiposOrdenadaPorPuntos.findIndex (equipo => equipo.EquipoId === this.MiEquipo.id) + 1;
            }
          }
        });
    }
  }

  RecuperarInscripcionesAlumnoJuego() {
    console.log('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.listaAlumnosOrdenadaPorPuntos = inscripciones;
        // ordena la lista por puntos
        // tslint:disable-next-line:only-arrow-functions
        this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function (obj1, obj2) {
          return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
        });
        console.log('ya tengo las inscripciones: ');
        this.TablaClasificacionTotal();
      });
  }

  RecuperarInscripcionesEquiposJuego() {
    console.log('vamos por las inscripciones ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionFormulaUno(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.listaEquiposOrdenadaPorPuntos = inscripciones;
        console.log(this.listaEquiposOrdenadaPorPuntos);

        // ordenamos por puntos
        // tslint:disable-next-line:only-arrow-functions
        this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function (obj1, obj2) {
          return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
        });
        console.log('ya tengo las inscripciones');
        this.TablaClasificacionTotal();
      });
  }

  AlumnosDelEquipo(equipo: Equipo) {
    console.log(equipo);

    this.peticionesAPI.DameAlumnosEquipo(equipo.id)
      .subscribe(res => {
        if (res[0] !== undefined) {
          this.alumnosEquipo = res;
          console.log(res);
        } else {
          console.log('No hay alumnos en este equipo');
          this.alumnosEquipo = undefined;
        }
      });
  }

  TablaClasificacionTotal() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingIndividualFormulaUno = this.calculos.PrepararTablaRankingIndividualFormulaUno(this.listaAlumnosOrdenadaPorPuntos,
        this.alumnosDelJuego);
      console.log('Ya tengo la tabla');
      console.log(this.rankingIndividualFormulaUno);
      this.TablaClasificacionMiAlumno();

    } else {

      this.rankingEquiposFormulaUno = this.calculos.PrepararTablaRankingEquipoFormulaUno(this.listaEquiposOrdenadaPorPuntos,
        this.equiposDelJuego);
      console.log('Ya tengo la tabla');
      console.log(this.rankingEquiposFormulaUno);
    }
  }

  TablaClasificacionMiAlumno() {
    for (let i = 0; i < this.rankingIndividualFormulaUno.length; i++) {
      if (this.rankingIndividualFormulaUno[i].id == this.MiAlumno.id) {
        console.log(this.rankingIndividualFormulaUno[i].id);
        this.infomialumno = this.rankingIndividualFormulaUno[i];
      }
    }
    console.log('toma a tu alumno');
    console.log(this.infomialumno);
    return this.infomialumno;
  }

  InformacionJornadas() {
    console.log('Aquí estará la información del juego');
    console.log('Voy a pasar la información del juego seleccionado');
    this.sesion.TomaJuego(this.juegoSeleccionado);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasF1(this.juegoSeleccionado, this.jornadas,
      this.rankingIndividualFormulaUno, this.rankingEquiposFormulaUno);
    console.log('Voy a pasar la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
      this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingIndividualFormulaUno);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposFormulaUno);
    this.navCtrl.navigateForward('/informacion-jornadas');
  }

  MuestraElRanking() {
    this.hideMe = true;
    this.scrollToBottom();
    console.log(this.hideMe)
  }
  OcultarElRanking() {
    this.scrollToTop();
    this.hideMe = false;
    console.log(this.hideMe)
  }
  scrollToBottom(): void {
    this.content.scrollToBottom(300);
  }
  scrollToTop() {
    this.content.scrollToTop();
  }


}
