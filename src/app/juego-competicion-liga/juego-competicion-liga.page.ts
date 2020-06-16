import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController} from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { Alumno, Equipo, Juego, TablaJornadas, AlumnoJuegoDeCompeticionLiga,
         TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, Jornada,
        EnfrentamientoLiga, EquipoJuegoDeCompeticionLiga } from '../clases/index';
import { SesionService } from '../servicios/sesion.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-juego-competicion-liga',
  templateUrl: './juego-competicion-liga.page.html',
  styleUrls: ['./juego-competicion-liga.page.scss'],
})
export class JuegoCompeticionLigaPage implements OnInit {

  juegoSeleccionado: Juego;
  MiAlumno: Alumno;
  MiEquipo: Equipo;
  MiAlumnoJuegoCompLiga: AlumnoJuegoDeCompeticionLiga;
  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionLiga[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionLiga[];
  rankingAlumnoJuegoDeCompeticion: TablaAlumnoJuegoDeCompeticion[] = [];
  rankingEquiposJuegoDeCompeticion: TablaEquipoJuegoDeCompeticion[] = [];
  infomialumno: TablaAlumnoJuegoDeCompeticion;

  alumnosEquipo: Alumno[];

  jornadas: Jornada[];
  JornadasCompeticion: TablaJornadas[] = [];
  // enfrentamientosDelJuego: EnfrentamientoLiga[] = [];
  enfrentamientosDelJuego: Array<Array<EnfrentamientoLiga>>;
  juegosActivosPuntos: Juego[] = [];

  public hideMe: boolean = false;
  
  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  @ViewChild('content', { static: false }) content: IonContent;

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.MiAlumno = this.sesion.DameAlumno();
    console.log('toma el id del alumno');
    console.log(this.MiAlumno);
    this.DameJornadasDelJuegoDeCompeticionSeleccionado();
  }

  DameJornadasDelJuegoDeCompeticionSeleccionado() {
    this.peticionesAPI.DameJornadasDeCompeticionLiga(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.jornadas = inscripciones;
        console.log('Las jornadas son: ');
        console.log(this.jornadas);
        console.log('Vamos a por los enfrentamientos de cada jornada');
        this.DameEnfrentamientosDelJuego();
      });
  }

  DameEnfrentamientosDelJuego() {
    console.log('Estoy en DameEnfrentamientosDeLasJornadas()');
    let jornadasCounter = 0;
    this.enfrentamientosDelJuego = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadas.length; i++) {
      this.enfrentamientosDelJuego[i] = [];
      this.peticionesAPI.DameEnfrentamientosDeCadaJornadaLiga(this.jornadas[i].id)
      .subscribe((enfrentamientosDeLaJornada: Array<EnfrentamientoLiga>) => {
        jornadasCounter++;
        console.log('Los enfrentamiendos de la jornadaId ' + this.jornadas[i].id + ' son: ');
        console.log(enfrentamientosDeLaJornada);
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < enfrentamientosDeLaJornada.length; j++) {
          this.enfrentamientosDelJuego[i][j] = new EnfrentamientoLiga();
          this.enfrentamientosDelJuego[i][j] = enfrentamientosDeLaJornada[j];
        }
        if (jornadasCounter === this.jornadas.length) {
          console.log('La lista final de enfrentamientos del juego es: ');
          console.log(this.enfrentamientosDelJuego);
          if (this.juegoSeleccionado.Modo === 'Individual') {
            this.AlumnosDelJuego();
          } else {
            this.EquiposDelJuego();
          }
        }
      });
    }
  }

  AlumnosDelJuego() {
    console.log ('Vamos a por los alumnos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameAlumnosJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(alumnosJuego => {
      console.log ('Ya tengo los alumnos: ' );
      console.log (alumnosJuego);
      this.alumnosDelJuego = alumnosJuego;
      this.RecuperarInscripcionesAlumnoJuego();
    });
  }

  
  EquiposDelJuego() {
    console.log ('Vamos a por los equipos');
    console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
    this.peticionesAPI.DameEquiposJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(equiposJuego => {
      console.log ('ya tengo los equipos');
      console.log (equiposJuego);
      this.equiposDelJuego = equiposJuego;
      this.RecuperarInscripcionesEquiposJuego();
      this.DameEquipoAlumnoConectado();
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

  DameEquipoAlumnoConectado() {
    console.log('voy a por el equipo del alumno');
    for (let i = 0; i < this.equiposDelJuego.length; i++) {
      this.peticionesAPI.DameAlumnosEquipo(this.equiposDelJuego[i].id)
        .subscribe(res => {
          console.log('miro en: ' + this.equiposDelJuego[i]);
          for (let j = 0; j < res.length; j++)
            if (res[j].id === this.MiAlumno.id) {
              console.log(res);
              this.MiEquipo = this.equiposDelJuego[i];
              console.log('tu equipo');
              console.log(this.MiEquipo);
            }
        });
    }
  }

  RecuperarInscripcionesAlumnoJuego() {
    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      console.log ('AlumnosJuegoDeCompeticionLiga: ');
      console.log (this.listaAlumnosOrdenadaPorPuntos);
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        console.log (obj2.PuntosTotalesAlumno + ' ; ' + obj1.PuntosTotalesAlumno);
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log(this.listaAlumnosOrdenadaPorPuntos);
      this.TablaClasificacionTotal();
    });
  }

    // Recupera los EquipoJuegoDeCompeticionLiga del juegoSeleccionado.id ordenados por puntos de mayor a menor
    RecuperarInscripcionesEquiposJuego() {
      this.peticionesAPI.DameInscripcionesEquipoJuegoDeCompeticionLiga(this.juegoSeleccionado.id)
      .subscribe(inscripciones => {
        this.listaEquiposOrdenadaPorPuntos = inscripciones;
        // ordena la lista por puntos
        // tslint:disable-next-line:only-arrow-functions
        this.listaEquiposOrdenadaPorPuntos = this.listaEquiposOrdenadaPorPuntos.sort(function(obj1, obj2) {
          console.log (obj2.PuntosTotalesEquipo + ' ; ' + obj1.PuntosTotalesEquipo);
          return obj2.PuntosTotalesEquipo - obj1.PuntosTotalesEquipo;
        });
        console.log(this.listaEquiposOrdenadaPorPuntos);
        this.TablaClasificacionTotal();
      });
    }
  
  TablaClasificacionTotal() {
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.rankingAlumnoJuegoDeCompeticion = this.calculos.PrepararTablaRankingIndividualLiga (this.listaAlumnosOrdenadaPorPuntos,
                                                                                               this.alumnosDelJuego, this.jornadas,
                                                                                               this.enfrentamientosDelJuego);
      console.log ('Estoy en TablaClasificacionTotal(), la tabla que recibo desde calculos es:');
      console.log (this.rankingAlumnoJuegoDeCompeticion);
      this.TablaClasificacionMiAlumno();

    } else {
      this.rankingEquiposJuegoDeCompeticion = this.calculos.PrepararTablaRankingEquipoLiga (this.listaEquiposOrdenadaPorPuntos,
                                                                                            this.equiposDelJuego, this.jornadas,
                                                                                            this.enfrentamientosDelJuego);
      console.log('Estoy en TablaClasificacionTotal(), la tabla que recibo desde calculos es:');
      console.log (this.rankingEquiposJuegoDeCompeticion);
    }
    

  }

  TablaClasificacionMiAlumno() {
    for(let i = 0; i < this.rankingAlumnoJuegoDeCompeticion.length; i++)
    {
      if (this.rankingAlumnoJuegoDeCompeticion[i].id == this.MiAlumno.id)
      {
        console.log(this.rankingAlumnoJuegoDeCompeticion[i].id);
        this.infomialumno = this.rankingAlumnoJuegoDeCompeticion[i];
      }
    }
    console.log('toma a tu alumno');
    console.log(this.infomialumno);
    return this.infomialumno;
  }

  InformacionJornadas() {
    console.log ('Aquí estará la información del juego');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    console.log('Los enfrentamientos del juego son: ');
    console.log(this.enfrentamientosDelJuego);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasLiga(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log('Las tablas JornadasCompeticionLiga son: ');
    console.log(this.JornadasCompeticion);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                      this.JornadasCompeticion);
    this.sesion.TomaTablaAlumnoJuegoDeCompeticion(this.rankingAlumnoJuegoDeCompeticion);
    this.sesion.TomaTablaEquipoJuegoDeCompeticion(this.rankingEquiposJuegoDeCompeticion);
    this.navCtrl.navigateForward('/informacion-jornadas');
  }

  MuestraElRanking() {
    this.hideMe = true;
    this.scrollToBottom();
  }
  OcultarElRanking(){
    this.scrollToTop();
    this.hideMe = false;
  }
  scrollToBottom(): void {
    this.content.scrollToBottom(300);
  }
  scrollToTop() {
    this.content.scrollToTop();
  }

}
