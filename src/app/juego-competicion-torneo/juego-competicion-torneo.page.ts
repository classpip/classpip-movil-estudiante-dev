import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController} from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { Alumno, Equipo, Juego, TablaJornadas, AlumnoJuegoDeCompeticionTorneo,AlumnoJuegoDeCompeticionLiga,EquipoJuegoDeCompeticionLiga,EnfrentamientoLiga,
         TablaAlumnoJuegoDeCompeticion, TablaEquipoJuegoDeCompeticion, Jornada,
        EnfrentamientoTorneo, EquipoJuegoDeCompeticionTorneo } from '../clases/index';
import { SesionService } from '../servicios/sesion.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-juego-competicion-torneo',
  templateUrl: './juego-competicion-torneo.page.html',
  styleUrls: ['./juego-competicion-torneo.page.scss'],
})
export class JuegoCompeticionTorneoPage implements OnInit {

   // Juego De CompeticionTorneo seleccionado
   juegoSeleccionado: Juego;
   juegosPuntos: Juego[] = [];
   juegosCuestionariosTerminados: Juego[] = [];
   juegosDeVotacionUnoATodosTerminados: any[] = [];
   jornadas: Jornada[];
   JornadasCompeticion: TablaJornadas[] = [];
 
   MiAlumno: Alumno;
   MiEquipo: Equipo;
   alumnosEquipo: Alumno[];
   alumnosDelJuego: Alumno[];
   equiposDelJuego: Equipo[];
   alumnosDelEquipo: Alumno[];
   enfrentamientosDelJuego: Array<Array<EnfrentamientoTorneo>>;
   participantestorneo:Array<Array<string>>;
   GanadorTorneo: any;
 
   listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
   listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];
 
   listaAlumnosOrdenadaPorPuntos: AlumnoJuegoDeCompeticionTorneo[];
   listaEquiposOrdenadaPorPuntos: EquipoJuegoDeCompeticionTorneo[];
   AlumnoJuegoDeCompeticionTorneo: AlumnoJuegoDeCompeticionTorneo[] = [];
   EquiposJuegoDeCompeticionTorneo: EquipoJuegoDeCompeticionTorneo[] = [];
   ctx;
 

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

  async DameJornadasDelJuegoDeCompeticionSeleccionado() {
    console.log ('voy a por las jornadas');
    const inscripciones = await this.peticionesAPI.DameJornadasDeCompeticionTorneo(this.juegoSeleccionado.id)
    .toPromise();
    this.jornadas = inscripciones;
    console.log('Las jornadas son: ');
    console.log(this.jornadas);
    console.log('Vamos a por los enfrentamientos de cada jornada');
    this.DameEnfrentamientosDelJuego();
        
        
     
      
  }

  async DameEnfrentamientosDelJuego() {
    console.log('Estoy en DameEnfrentamientosDeLasJornadas()');
    let jornadasCounter = 0;
    this.enfrentamientosDelJuego = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.jornadas.length; i++) {
      console.log ('siguiente jornada');
      this.enfrentamientosDelJuego[i] = [];
      const enfrentamientosDeLaJornada = await this.peticionesAPI.DameEnfrentamientosDeCadaJornadaTorneo(this.jornadas[i].id)
      .toPromise();
      jornadasCounter++;
      console.log('Los enfrentamiendos de la jornadaId ' + this.jornadas[i].id + ' son: ');
      console.log(enfrentamientosDeLaJornada);
        // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < enfrentamientosDeLaJornada.length; j++) {
          this.enfrentamientosDelJuego[i][j] = new EnfrentamientoTorneo();
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
        
     
    }
    
  }
  DameNombresDeLosEnfrentamientos() {
    console.log ('voy a por los nombres de los participantes');
    let enfrentamientosjornada: Array<Array<number>>;
    enfrentamientosjornada= [];
    this.participantestorneo= [];
    let rondas: number =this.enfrentamientosDelJuego.length;
    let rondafinal: number;
    rondafinal=rondas-1;
    console.log ('num jornadas: '+this.enfrentamientosDelJuego.length);
    
    for (let i = 0; i < this.enfrentamientosDelJuego.length; i++) {
      if (this.enfrentamientosDelJuego[i].length !== 0) {
        for (let j=0; j < this.enfrentamientosDelJuego[i].length; j++) {
          if (this.enfrentamientosDelJuego[i][j].JugadorUno !== 0 && this.enfrentamientosDelJuego[i][j].JugadorDos !== 0) {
            if (this.juegoSeleccionado.Modo === 'Individual') {
              const alumno = this.alumnosDelJuego.filter (alumno => alumno.id === Number(this.enfrentamientosDelJuego[i][j].JugadorUno))[0];
              const alumno2 = this.alumnosDelJuego.filter (alumno => alumno.id === Number(this.enfrentamientosDelJuego[i][j].JugadorDos))[0];
              console.log ('alumno1 encontrado:  ' + alumno.Nombre);
              console.log ('alumno2 encontrado:  ' + alumno2.Nombre);
              this.enfrentamientosDelJuego[i][j].nombreJugadorUno = alumno.Nombre + ' ' + alumno.PrimerApellido;
              this.enfrentamientosDelJuego[i][j].nombreJugadorDos = alumno2.Nombre + ' ' + alumno2.PrimerApellido;
            } else {
              const equipo = this.equiposDelJuego.filter (equipo => equipo.id === Number(this.enfrentamientosDelJuego[i][j].JugadorUno))[0];
              const equipo2 = this.equiposDelJuego.filter (equipo => equipo.id === Number(this.enfrentamientosDelJuego[i][j].JugadorDos))[0];
              console.log ('equipo1 encontrado:  ' + equipo.Nombre);
              console.log ('equipo2 encontrado:  ' + equipo2.Nombre);
              this.enfrentamientosDelJuego[i][j].nombreJugadorUno = equipo.Nombre;
              this.enfrentamientosDelJuego[i][j].nombreJugadorDos = equipo2.Nombre;
            }
          } else if (this.enfrentamientosDelJuego[i][j].JugadorUno === 0 ){
            if (this.juegoSeleccionado.Modo === 'Individual') {
              const alumno2 = this.alumnosDelJuego.filter (alumno => alumno.id === Number(this.enfrentamientosDelJuego[i][j].JugadorDos))[0];
              console.log ('alumno2 encontrado:  ' + alumno2.Nombre);
              this.enfrentamientosDelJuego[i][j].nombreJugadorUno = 'Jugador Fantasma';
              this.enfrentamientosDelJuego[i][j].nombreJugadorDos = alumno2.Nombre + alumno2.PrimerApellido;
            } else {
              const equipo2 = this.equiposDelJuego.filter (equipo => equipo.id === Number(this.enfrentamientosDelJuego[i][j].JugadorDos))[0];
              console.log ('equipo2 encontrado:  ' + equipo2.Nombre);
              this.enfrentamientosDelJuego[i][j].nombreJugadorUno = 'Equipo Fantasma';
              this.enfrentamientosDelJuego[i][j].nombreJugadorDos = equipo2.Nombre;
            }
            
          } else if (this.enfrentamientosDelJuego[i][j].JugadorDos === 0 ){
            if (this.juegoSeleccionado.Modo === 'Individual') {
              const alumno2 = this.alumnosDelJuego.filter (alumno => alumno.id === Number(this.enfrentamientosDelJuego[i][j].JugadorUno))[0];
              console.log ('alumno2 encontrado:  ' + alumno2.Nombre);
              this.enfrentamientosDelJuego[i][j].nombreJugadorUno = alumno2.Nombre + alumno2.PrimerApellido;
              this.enfrentamientosDelJuego[i][j].nombreJugadorDos = 'Jugador Fantasma';
            } else {
              const equipo2 = this.equiposDelJuego.filter (equipo => equipo.id === Number(this.enfrentamientosDelJuego[i][j].JugadorUno))[0];
              console.log ('equipo2 encontrado:  ' + equipo2.Nombre);
              this.enfrentamientosDelJuego[i][j].nombreJugadorUno = equipo2.Nombre;
              this.enfrentamientosDelJuego[i][j].nombreJugadorDos = 'Equipo Fantasma';
            }
            
          }
          if (this.enfrentamientosDelJuego[i][j].Ganador !== undefined){
            if (this.enfrentamientosDelJuego[i][j].Ganador === this.enfrentamientosDelJuego[i][j].JugadorUno){
              this.enfrentamientosDelJuego[i][j].nombreGanador = this.enfrentamientosDelJuego[i][j].nombreJugadorUno;
            } else if (this.enfrentamientosDelJuego[i][j].Ganador === this.enfrentamientosDelJuego[i][j].JugadorDos){
              this.enfrentamientosDelJuego[i][j].nombreGanador = this.enfrentamientosDelJuego[i][j].nombreJugadorDos;
            }
          }
        }
      }
    }

    console.log ('prueba enfrentamientos:  ' + this.enfrentamientosDelJuego[0][0].nombreJugadorUno);
     if (this.enfrentamientosDelJuego[rondafinal][0] !== undefined) {
       if (this.enfrentamientosDelJuego[rondafinal][0].Ganador!== undefined) {
         this.DameNombreGanador();
        }
      }
  //console.log ('finales' +  this.participantestorneo[1][0].Nombre);
}
DameNombreGanador() {
  console.log ('voy a por el nombre del ganador');
  let rondas: number =this.enfrentamientosDelJuego.length;
  let rondafinal: number;
  rondafinal=rondas-1;
  let idganador: number;
  console.log ('numRondas: '+ rondafinal);
  if (this.enfrentamientosDelJuego[rondafinal][0] !== undefined) {
    if (this.enfrentamientosDelJuego[rondafinal][0].Ganador!== undefined) {
      idganador = this.enfrentamientosDelJuego[rondafinal][0].Ganador;
      console.log ('idganador: '+ idganador);
      if (this.juegoSeleccionado.Modo === 'Individual') {
      const alumno = this.alumnosDelJuego.filter (alumno => alumno.id === Number(idganador))[0];
      console.log ('alumnoganador: '+ alumno);
      this.GanadorTorneo= alumno.Nombre;
      } else{
        const equipo = this.equiposDelJuego.filter (equipo => equipo.id === Number(idganador))[0];
      console.log ('equipoganador: '+ equipo);
      this.GanadorTorneo= equipo.Nombre;
      }
    }
  }
    console.log ('GANADOR: '+   this.GanadorTorneo);
}


async AlumnosDelJuego() {
  console.log ('Vamos a por los alumnos');
  console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
  const alumnosJuego = await this.peticionesAPI.DameAlumnosJuegoDeCompeticionTorneo(this.juegoSeleccionado.id)
  .toPromise();
  console.log ('Ya tengo los alumnos: ' );
  console.log (alumnosJuego);
  this.alumnosDelJuego = alumnosJuego;
  this.DameNombresDeLosEnfrentamientos();
   // this.RecuperarInscripcionesAlumnoJuego();

  
}
async EquiposDelJuego() {
  console.log ('Vamos a por los equipos');
  console.log('Id juegoSeleccionado: ' + this.juegoSeleccionado.id);
  const equiposJuego = await this.peticionesAPI.DameEquiposJuegoDeCompeticionTorneo(this.juegoSeleccionado.id)
  .toPromise();

  console.log ('ya tengo los equipos');
  console.log (equiposJuego);
  this.equiposDelJuego = equiposJuego;
  //this.RecuperarInscripcionesEquiposJuego();
  this.DameNombresDeLosEnfrentamientos();
  this.DameEquipoAlumnoConectado();
  
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
            }
          }
        });
    }
  }


 

  InformacionJornadas() {
    console.log ('Aquí estará la información del juego');
    console.log ('Voy a por la información del juego seleccionado');
    this.sesion.TomaJuego (this.juegoSeleccionado);
    console.log('Tomo las jornadas' + this.jornadas);
    console.log('Los enfrentamientos del juego son: ');
    console.log(this.enfrentamientosDelJuego);
    this.JornadasCompeticion = this.calculos.GenerarTablaJornadasTorneo(this.juegoSeleccionado, this.jornadas, this.enfrentamientosDelJuego);
    console.log('Las tablas JornadasCompeticionTorneo son: ');
    console.log(this.JornadasCompeticion);
    console.log ('Voy a por la información de las jornadas del juego');
    this.sesion.TomaDatosJornadas(this.jornadas,
                                      this.JornadasCompeticion);
    this.sesion.TomaAlumnoJuegoDeCompeticionTorneo(this.alumnosDelJuego);
    this.sesion.TomaEquipoJuegoDeCompeticionTorneo(this.equiposDelJuego);
    this.sesion.TomaAlumno (this.MiAlumno);
    this.sesion.TomaEquipo(this.MiEquipo);
    this.navCtrl.navigateForward('/informacion-jornadas');
  }
  EsEmparejamientoPar(n: number): boolean {
    const res = Math.floor (n / 2) % 2;
    if (res  === 0) {
      return true;
    } else {
      return false;
    }
  }

  

}
