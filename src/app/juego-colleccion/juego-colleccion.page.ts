import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService } from '../servicios/sesion.service';
import { NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
import { PeticionesAPIService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {
  Juego, Equipo, Alumno, MiAlumnoAMostrarJuegoDePuntos, Grupo,
  MiEquipoAMostrarJuegoDePuntos, Cromo
} from '../clases/index';

@Component({
  selector: 'app-juego-colleccion',
  templateUrl: './juego-colleccion.page.html',
  styleUrls: ['./juego-colleccion.page.scss'],
})
export class JuegoColleccionPage implements OnInit {

  juegoSeleccionado: Juego;
  MisAlumnosAMostrar: MiAlumnoAMostrarJuegoDePuntos[] = [];
  MisEquiposJuegoPuntosAMostrar: MiEquipoAMostrarJuegoDePuntos[] = [];

  MisAlumnosJuegoColeccion: Alumno[] = [];
  MisEquiposJuegoColecciones: Equipo[] = [];

  //De mi Alumno conectado
  MiAlumno: Alumno;
  MiEquipo: Equipo;
  alumnosMiEquipo: Alumno[];
  Grupo: Grupo;
  AlumnoMisImagenesCromoDelante: string[] = [];
  AlumnoMisImagenesCromoDetras: string[] = [];
  AlumnoMisCromos: Cromo[] = [];
  AlumnolistaCromosSinRepetidos: any[];
  AlumnoCromosQueNoTengo: any[] = [];
  AlumnoImagenesCromosQueNoTengoDelante: string[] = [];
  AlumnoImagenesCromosQueNoTengoDetras: string[] = [];

  //Cromos
  Miequipo: Equipo;
  Mialumno: Alumno;
  alumnosEquipo: Alumno[];
  MisImagenesCromo: string[] = [];
  MisCromos: Cromo[] = [];
  listaCromosSinRepetidos: any[];
  CromosQueNoTengo: any[];
  CromosQueNoTengoDelante: any[] = [];
  CromosQueNoTengoDetras: any[] = [];
  ImagenesCromosQueNoTengoDelante: string[] = [];
  ImagenesCromosQueNoTengoDetras: string[] = [];

  //Mostrar ranking
  public hideMe: boolean = false;
  //Mostrar cromos alumno/equipo
  infoView: boolean = false;

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
    this.MiEquipo = this.sesion.DameEquipo();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.sesion.TomaAlumnoJuegoDeColeccion(this.MiAlumno);
      this.MiAlumno = this.sesion.DameAlumnoJuegoDeColeccion();
      console.log('este es tu alumno');
      console.log(this.MiAlumno);
      console.log(this.juegoSeleccionado);
      this.DameLosCromosDeMiAlumno();
      this.MisAlumnosJuegoColeccion = this.calculos.DameAlumnosJuegoDeColecciones(this.juegoSeleccionado.id);
      console.log('Estos son los alumnos del Juego de Col');
      console.log(this.MisAlumnosJuegoColeccion);
    } else {
      this.peticionesAPI.DameEquiposJuegoDeColeccion(this.juegoSeleccionado.id).subscribe(
        listaEquipos => {
          this.MisEquiposJuegoColecciones = listaEquipos;
          this.DameEquipoAlumnoConectado();
          console.log('Aquí están los equipos');
          console.log(this.MisEquiposJuegoColecciones);
        });
    }
  }

  DameEquipoAlumnoConectado() {
    for ( let i = 0; i < this.MisEquiposJuegoColecciones.length; i++){
      this.peticionesAPI.DameAlumnosEquipo(this.MisEquiposJuegoColecciones[i].id)
      .subscribe(res => {
        for (let j = 0; j < res.length; j++)
          if (res[j].Nombre === this.MiAlumno.Nombre) {
            this.alumnosMiEquipo = res;
            console.log(res);
            this.MiEquipo = this.MisEquiposJuegoColecciones[i];
            console.log('tu equipo');
            console.log(this.MiEquipo);
          } else {
            console.log('No hay alumnos en este equipo');
            this.alumnosMiEquipo = undefined;
          }
      });
    }
  }

  // Aquí trabajaremos el tema cromos
  DameLosCromosDeMiAlumno() {
    this.sesion.TomaAlumnoJuegoDeColeccion(this.MiAlumno);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.Mialumno = this.sesion.DameAlumnoJuegoDeColeccion();
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeColeccion(this.juegoSeleccionado.id, this.Mialumno.id).subscribe(
        InscripcionAlumno => {
          this.peticionesAPI.DameCromosAlumno(InscripcionAlumno[0].id).subscribe(
            CromosAlumno => {
              console.log(CromosAlumno);
              this.AlumnoMisCromos = CromosAlumno;
              this.AlumnolistaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.AlumnoMisCromos);
              console.log(this.AlumnolistaCromosSinRepetidos);
              this.sesion.TomaCromosSinRepetidos(this.AlumnolistaCromosSinRepetidos);
              this.AlumnoMisImagenesCromoDelante = this.calculos.VisualizarLosCromosDelante(this.AlumnolistaCromosSinRepetidos);
              this.AlumnoMisImagenesCromoDetras = this.calculos.VisualizarLosCromosDetras(this.AlumnolistaCromosSinRepetidos);
              this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
                TodosLosCromosAlumno => {
                  this.AlumnoCromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.AlumnoMisCromos, TodosLosCromosAlumno);
                  this.AlumnoImagenesCromosQueNoTengoDelante = this.calculos.VisualizarLosCromosDelante(this.AlumnoCromosQueNoTengo);
                  this.AlumnoImagenesCromosQueNoTengoDetras = this.calculos.VisualizarLosCromosDetras(this.AlumnoCromosQueNoTengo);
                });
              console.log('Cromos de tu alumno conectado:');
              console.log(this.AlumnoCromosQueNoTengo);
            });
        });
      // this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
      console.log('cromos de mi alumno');
      console.log(this.AlumnoMisCromos);
      console.log('y si lista de cromos sin repetidos');
      console.log(this.AlumnolistaCromosSinRepetidos);
      // this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

      // this.MisImagenesCromo = this.calculos.VisualizarCromosDelAlumno(this.MisCromos);
    }
  }

  // Obtenemos los cromos de los demás en el ranking
  DameCromosDelAlumno(alumno: any) {
    this.toggleInfoView();
    this.sesion.TomaAlumnoJuegoDeColeccion(alumno);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.Mialumno = this.sesion.DameAlumnoJuegoDeColeccion();
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeColeccion(this.juegoSeleccionado.id, this.Mialumno.id).subscribe(
        InscripcionAlumno => {
          this.peticionesAPI.DameCromosAlumno(InscripcionAlumno[0].id).subscribe(
            Cromos => {
              console.log(Cromos);
              this.MisCromos = Cromos;
              this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
              console.log(this.listaCromosSinRepetidos);
              this.sesion.TomaCromosSinRepetidos(this.listaCromosSinRepetidos);
              this.MisImagenesCromo = this.calculos.VisualizarLosCromosDelante(this.listaCromosSinRepetidos);
              this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
                TodosLosCromos => {
                  this.CromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.MisCromos, TodosLosCromos);
                  this.ImagenesCromosQueNoTengoDelante = this.calculos.VisualizarLosCromosDelante(this.CromosQueNoTengo);
                });
              console.log('Cromos que no tengo:');
              console.log(this.CromosQueNoTengoDelante);
            });
        });
      // this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
      console.log(this.MisCromos);
      console.log(this.listaCromosSinRepetidos);
      // this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

      // this.MisImagenesCromo = this.calculos.VisualizarCromosDelAlumno(this.MisCromos);
    } else {
      console.log('Voy a buscar los cromos del Equipo');
      this.sesion.TomaEquipo(alumno);
      this.Miequipo = this.sesion.DameEquipo();
      this.AlumnosDelEquipo(this.Miequipo);
      this.peticionesAPI.DameInscripcionEquipoJuegoDeColeccion(this.juegoSeleccionado.id, this.Miequipo.id).subscribe(
        InscripcionEquipo => {
          this.peticionesAPI.DameCromosEquipo(InscripcionEquipo[0].id).subscribe(
            Cromos => {
              console.log(Cromos);
              this.MisCromos = Cromos;
              this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
              console.log(this.listaCromosSinRepetidos);
              this.MisImagenesCromo = this.calculos.VisualizarLosCromosDelante(this.listaCromosSinRepetidos);
              this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
                TodosLosCromos => {
                  this.CromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.MisCromos, TodosLosCromos);
                  this.ImagenesCromosQueNoTengoDelante = this.calculos.VisualizarLosCromosDelante(this.CromosQueNoTengo);
                });
            });
        });
      console.log(this.MisImagenesCromo);
    }
  }

  // intercambiar Cromo
  intercambiarCromo() {
    this.navCtrl.navigateForward('intercambiar-cromos')
  }
  
  // Alumnos de cada equipo
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

  // Mostrar Ranking y scroll up/down de la pantalla
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

  // configuramos el slider de los cromos
  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };
  // y el botón para mostrarlos
  toggleInfoView() {
    this.infoView = !this.infoView;
  }
  cierraOtrosAlbumes() {
    if (this.infoView == true) {
      this.infoView = false;
    }
  }
  
  /* Nuevo método para obtener las imagenes */
  
}

