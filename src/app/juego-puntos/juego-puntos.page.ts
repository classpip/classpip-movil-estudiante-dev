import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {
  Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, TablaHistorialPuntosEquipo
} from '../clases/index';
import { SesionService } from '../servicios/sesion.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-juego-puntos',
  templateUrl: './juego-puntos.page.html',
  styleUrls: ['./juego-puntos.page.scss'],
})
export class JuegoPuntosPage implements OnInit {

  infoPuntosView: boolean = false;
  infoView: boolean = false;
  juegoSeleccionado: Juego;
  MiAlumno: Alumno;
  MiEquipo: Equipo;
  MiHistorialPuntos: any[] = [];
  EsteAlumnoJuegoDePuntos: any[] = [];
  MiNivel: Nivel;
  NombreNivel: string;
  MiAlumnoJDP: number;
  TodosLosPuntos: Punto[] = [];
  nivelesDelJuego: Nivel[];

  alumnosDelJuego: Alumno[];
  equiposDelJuego: Equipo[];
  historial: TablaHistorialPuntosEquipo[] = [];

  alumnosEquipo: Alumno[];

  // Recoge la inscripción de un alumno en el juego ordenada por puntos
  listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDePuntos[];
  listaEquiposOrdenadaPorPuntos: EquipoJuegoDePuntos[];
  equipoJuegoDePuntos: EquipoJuegoDePuntos;

  // Muestra la posición del alumno, el nombre y los apellidos del alumno, los puntos y el nivel
  rankingJuegoDePuntos: TablaAlumnoJuegoDePuntos[] = [];
  rankingEquiposJuegoDePuntos: TablaEquipoJuegoDePuntos[] = [];

  // EN el panel que muestra la info, enseñaremos los puntos de porfma preddeterminada
  Tipo: String;

  public hideMe: boolean = false;
  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }
  @ViewChild('content', { static: false }) content: IonContent;
  toggleInfoView() {
    this.infoView = !this.infoView;
  }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.MiAlumno = this.sesion.DameAlumno();
    console.log(this.MiAlumno);
    console.log(this.MiEquipo)
    console.log(this.juegoSeleccionado.id);
    this.NivelesJuego();
    this.DamePuntosDelJuego();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.calculos.DameHistorialMisPuntos(this.juegoSeleccionado.id, this.MiAlumno.id).subscribe(
        lista => {
          console.log(lista);
          this.EsteAlumnoJuegoDePuntos = lista.AlumnoJDP;
          console.log(this.EsteAlumnoJuegoDePuntos[0]);
          this.MiHistorialPuntos = lista.Historial;
          this.peticionesAPI.DameInscripcionAlumnoJuegoDePuntos(this.MiAlumno.id, this.juegoSeleccionado.id).subscribe(
            AlumnoJDP => {
              this.MiAlumnoJDP = AlumnoJDP[0].PuntosTotalesAlumno;
              console.log(this.MiAlumnoJDP);
            });
        }
      );
      this.AlumnosDelJuego();
    } else {
      this.EquiposDelJuego();
    }
  }

  // Recupera los alumnos que pertenecen al juego
  AlumnosDelJuego() {
    console.log('Vamos a pos los alumnos');
    this.peticionesAPI.DameAlumnosJuegoDePuntos(this.juegoSeleccionado.id)
      .subscribe(alumnosJuego => {
        console.log('Ya tengo los alumnos');
        console.log(alumnosJuego);
        this.alumnosDelJuego = alumnosJuego;
        this.RecuperarInscripcionesAlumnoJuego();
      });
  }

  // Recupera los equipos que pertenecen al juego
  EquiposDelJuego() {
    this.peticionesAPI.DameEquiposJuegoDePuntos(this.juegoSeleccionado.id)
      .subscribe(equiposJuego => {
        console.log('ya tengo los equipos');
        this.equiposDelJuego = equiposJuego;
        this.RecuperarInscripcionesEquiposJuego();
      });
  }

  // Recupera los niveles de los que dispone el juego
  NivelesJuego() {
    this.peticionesAPI.DameNivelesJuegoDePuntos(this.juegoSeleccionado.id)
      .subscribe(niveles => {
        this.nivelesDelJuego = niveles;
        console.log('Los niveles del juego son')
        console.log(this.nivelesDelJuego)
        for (let i = 0; i < this.nivelesDelJuego.length; i++) {
          console.log('entro a buscar nivel y foto');
          console.log(this.nivelesDelJuego[i]);
          if (this.nivelesDelJuego[i].Imagen !== undefined) {
            // Busca en la base de datos la imágen con el nombre registrado en equipo.FotoEquipo y la recupera
            this.peticionesAPI.DameImagenNivel(this.nivelesDelJuego[i].Imagen)
              .subscribe(response => {
                const blob = new Blob([response.blob()], { type: 'image/jpg' });
    
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  this.nivelesDelJuego[i].Imagen = reader.result.toString();
                }, false);
    
                if (blob) {
                  reader.readAsDataURL(blob);
                }
              });
    
            // Sino la imagenLogo será undefined para que no nos pinte la foto de otro equipo préviamente seleccionado
          } else {
            this.nivelesDelJuego[i].Imagen = undefined;
          }
        }
      });
  }

DamePuntosDelJuego() {
  this.peticionesAPI.DamePuntosJuegoDePuntos(this.juegoSeleccionado.id).subscribe(
    puntos => {
      this.TodosLosPuntos = puntos;
      console.log(this.TodosLosPuntos);
    }
  );
}

// Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
RecuperarInscripcionesAlumnoJuego() {
  this.peticionesAPI.DameInscripcionesAlumnoJuegoDePuntos(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.listaAlumnosOrdenadaPorPuntos = inscripciones;
      // ordena la lista por puntos
      // tslint:disable-next-line:only-arrow-functions
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function (obj1, obj2) {
        return obj2.PuntosTotalesAlumno - obj1.PuntosTotalesAlumno;
      });
      console.log('ya tengo las inscripciones');
      // this.OrdenarPorPuntos();
      this.TablaClasificacionTotal();
    });
}

// Recupera las inscripciones de los alumnos en el juego y los puntos que tienen y los ordena de mayor a menor valor
RecuperarInscripcionesEquiposJuego() {
  console.log('vamos por las inscripciones ' + this.juegoSeleccionado.id);
  this.peticionesAPI.DameInscripcionesEquipoJuegoDePuntos(this.juegoSeleccionado.id)
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

// Alumnos de cada equipo
AlumnosDelEquipo(equipo: Equipo) {
  console.log(equipo);
  this.cierraOtrosAlbumes();

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


// En función del modo, recorremos la lisa de Alumnos o de Equipos y vamos rellenando el rankingJuegoDePuntos
// ESTO DEBERIA IR AL SERVICIO DE CALCULO, PERO DE MOMENTO NO LO HAGO PORQUE SE GENERAN DOS TABLAS
// Y NO COMPRENDO BIEN LA NECESIDAD DE LAS DOS
TablaClasificacionTotal() {

  if (this.juegoSeleccionado.Modo === 'Individual') {
    this.rankingJuegoDePuntos = this.calculos.PrepararTablaRankingIndividual(
      this.listaAlumnosOrdenadaPorPuntos,
      this.alumnosDelJuego,
      this.nivelesDelJuego
    );
    console.log('Ya tengo la tabla');
    console.log(this.rankingJuegoDePuntos);
  } else {

    this.rankingEquiposJuegoDePuntos = this.calculos.PrepararTablaRankingEquipos(
      this.listaEquiposOrdenadaPorPuntos, this.equiposDelJuego, this.nivelesDelJuego
    );
    console.log('ranking ' + this.rankingEquiposJuegoDePuntos);
    console.log(this.rankingEquiposJuegoDePuntos);
  }
}

AccederEquipo(equipo: TablaEquipoJuegoDePuntos) {
  this.muestraPuntosEquipo();
  const equipoSeleccionado = this.equiposDelJuego.filter(res => res.Nombre === equipo.nombre)[0];


  const posicion = this.rankingEquiposJuegoDePuntos.filter(res => res.nombre === equipo.nombre)[0].posicion;
  console.log(posicion);
  // Informacion que se necesitara para ver la evolución del equipo

  this.sesion.TomaDatosEvolucionEquipoJuegoPuntos(
    posicion,
    equipoSeleccionado,
    this.listaEquiposOrdenadaPorPuntos.filter(res => res.equipoId === equipoSeleccionado.id)[0],
    this.nivelesDelJuego,
    this.TodosLosPuntos
  );
  this.MostrarHistorialSeleccionado();
}

MostrarHistorialSeleccionado() {
  const res = this.sesion.DameDatosEvolucionEquipoJuegoPuntos();
  this.equipoJuegoDePuntos = res.inscripcionEquipoJuego;
  // traigo el historial
  this.calculos.PreparaHistorialEquipo(this.equipoJuegoDePuntos, this.TodosLosPuntos).
    subscribe(res => {
      this.historial = res;
      console.log(this.historial);
    });
}

MuestraElRanking() {
  this.hideMe = true;
  this.scrollToBottom();
  console.log(this.hideMe)
}
OcultarElRanking(){
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

// configuramos el slider de los cromos
sliderConfig = {
  slidesPerView: 1.6,
  spaceBetween: 10,
  centeredSlides: true
};

// Muestra los puntos de cada equipo
muestraPuntosEquipo() {
  this.infoPuntosView = !this.infoPuntosView;
}

// Cerrar otros dialogos de puntos del equipo si estuvieran abiertos
cierraOtrosAlbumes() {
  if (this.infoPuntosView == true) {
    this.infoPuntosView = false;
  }
}
ionViewWillEnter (){
  this.Tipo = "Puntos";
}
}
