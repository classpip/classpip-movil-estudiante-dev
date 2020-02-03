import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {  Juego, Equipo, Alumno, AlumnoJuegoDePuntos, Nivel, TablaEquipoJuegoDePuntos} from '../clases/index';
import { SesionService} from '../servicios/sesion.service';
@Component({
  selector: 'app-mis-puntos',
  templateUrl: './mis-puntos.page.html',
  styleUrls: ['./mis-puntos.page.scss'],
})
export class MisPuntosPage implements OnInit {
  juegoSeleccionado: Juego;
  MiAlumno: Alumno;
  MiHistorialPuntos: any [] = [];
  EsteAlumnoJuegoDePuntos: any[] = [];
  NivelesDelJuego: Nivel[] = [];
  MiNivel: Nivel;
  NombreNivel: string;
  MiAlumnoJDP: number;
  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.MiAlumno = this.sesion.DameAlumno();
    console.log(this.MiAlumno.id);
    console.log(this.juegoSeleccionado.id);
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
            this.peticionesAPI.DameNivelesJuegoDePuntos(this.juegoSeleccionado.id).subscribe(
              Niveles => {
                this.NivelesDelJuego = Niveles;
                this.MiNivel = this.NivelesDelJuego.filter (nivel => nivel.id === AlumnoJDP[0].nivelId)[0];
                console.log(this.MiNivel.Nombre);
                this.NombreNivel = this.MiNivel.Nombre;
                console.log(this.NombreNivel);
              }
            );
          });
      }
    );
  }

  VerRanking() {
    this.navCtrl.navigateForward('/juego-seleccionado');
  }

  VerInformacion() {
    this.navCtrl.navigateForward('/informacion');
  }

}
