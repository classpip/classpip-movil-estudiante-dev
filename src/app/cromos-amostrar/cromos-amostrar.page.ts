import { Component, OnInit } from '@angular/core';
import { SesionService} from '../servicios/sesion.service';
import { CalculosService } from '../servicios/calculos.service';
import { PeticionesAPIService} from '../servicios/index';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Equipo, Juego, Cromo, Alumno } from '../clases';

@Component({
  selector: 'app-cromos-amostrar',
  templateUrl: './cromos-amostrar.page.html',
  styleUrls: ['./cromos-amostrar.page.scss'],
})
export class CromosAMostrarPage implements OnInit {

  juegoSeleccionado: Juego;
  Miequipo: Equipo;
  Mialumno: Alumno;
  MisImagenesCromo: string[] = [];
  MisCromos: Cromo[] = [];
  listaCromosSinRepetidos: any [];
  CromosQueNoTengo: any[] = [];
  ImagenesCromosQueNoTengo: string[] = [];

  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private calculos: CalculosService,
    private peticionesAPI: PeticionesAPIService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
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
              this.MisImagenesCromo = this.calculos.VisualizarLosCromos(this.listaCromosSinRepetidos);
              this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
                TodosLosCromos => {
                  this.CromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.MisCromos, TodosLosCromos);
                  this.ImagenesCromosQueNoTengo = this.calculos.VisualizarLosCromos(this.CromosQueNoTengo);
                });
              console.log('Cromos que no tengo:');
              console.log(this.CromosQueNoTengo);
            });
        });
      // this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
      console.log(this.MisCromos);
      console.log(this.listaCromosSinRepetidos);
      // this.listaCromosSinRepetidos.sort((a, b) => a.cromo.Nombre.localeCompare(b.cromo.Nombre));

      // this.MisImagenesCromo = this.calculos.VisualizarCromosDelAlumno(this.MisCromos);
    } else {
      this.Miequipo = this.sesion.DameEquipo();
      this.peticionesAPI.DameInscripcionEquipoJuegoDeColeccion(this.juegoSeleccionado.id, this.Miequipo.id).subscribe(
        InscripcionEquipo => {
          this.peticionesAPI.DameCromosEquipo(InscripcionEquipo[0].id).subscribe(
            Cromos => {
              console.log(Cromos);
              this.MisCromos = Cromos;
              this.listaCromosSinRepetidos = this.calculos.GeneraListaSinRepetidos(this.MisCromos);
              console.log(this.listaCromosSinRepetidos);
              this.MisImagenesCromo = this.calculos.VisualizarLosCromos(this.listaCromosSinRepetidos);
              this.peticionesAPI.DameCromosColeccion(this.juegoSeleccionado.coleccionId).subscribe(
                TodosLosCromos => {
                  this.CromosQueNoTengo = this.calculos.DameCromosQueNoTengo(this.MisCromos, TodosLosCromos);
                  this.ImagenesCromosQueNoTengo = this.calculos.VisualizarLosCromos(this.CromosQueNoTengo);
                });
            });
        });
      console.log(this.MisImagenesCromo);
    }
  }


}
