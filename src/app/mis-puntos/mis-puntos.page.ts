import { Component, OnInit, NgModule } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { Juego, Equipo, Alumno, AlumnoJuegoDePuntos, Nivel, TablaEquipoJuegoDePuntos, Punto } from '../clases/index';
import { SesionService } from '../servicios/sesion.service';


@Component({
  selector: 'app-mis-puntos',
  templateUrl: './mis-puntos.page.html',
  styleUrls: ['./mis-puntos.page.scss'],
})

export class MisPuntosPage implements OnInit {
  
  infoView: boolean = false;
  juegoSeleccionado: Juego;
  MiAlumno: Alumno;
  MiHistorialPuntos: any[] = [];
  EsteAlumnoJuegoDePuntos: any[] = [];
  NivelesDelJuego: Nivel[] = [];
  MiNivel: Nivel;
  NombreNivel: string;
  MiAlumnoJDP: number;
  TodosLosPuntos: Punto[] = [];

  constructor(
    private sesion: SesionService,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private calculos: CalculosService,
  ) { }

  toggleInfoView () {
    this.infoView = !this.infoView;
  }

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
            this.peticionesAPI.DamePuntosJuegoDePuntos(this.juegoSeleccionado.id).subscribe(
              puntos => {
                this.TodosLosPuntos = puntos;
                console.log(this.TodosLosPuntos);
              }
            );
          });
      }
    );
  }

  VerRanking() {
    this.navCtrl.navigateForward('/juego-seleccionado');
  }

}
