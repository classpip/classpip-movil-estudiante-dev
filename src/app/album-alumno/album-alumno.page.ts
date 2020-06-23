import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import {
  Juego, Equipo, Alumno, MiAlumnoAMostrarJuegoDePuntos, Grupo,
  MiEquipoAMostrarJuegoDePuntos, Cromo, Coleccion, ParaAlbum
} from '../clases/index';

import * as URL from '../URLs/urls';

@Component({
  selector: 'app-album-alumno',
  templateUrl: './album-alumno.page.html',
  styleUrls: ['./album-alumno.page.scss'],
})
export class AlbumAlumnoPage implements OnInit {

  coleccion: Coleccion;
  cromosAlumno: Cromo[];
  cromosColeccion: Cromo[];

  albumDelAlumno: ParaAlbum[] = [];
  imagenCromoDelante: string[] = [];
  imagenCromoDetras: string[] = [];
  tengoCromo: boolean[] = [];
  cromo: Cromo;
  voltear = false;

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,

  ) { }

  ngOnInit() {
    this.coleccion = this.sesion.DameColeccion();
    this.cromosAlumno = this.sesion.DameCromos();
    this.CromosDeLaColeccion(this.coleccion);
  }


  // Le pasamos la coleccion y buscamos la imagen que tiene y sus cromos
  CromosDeLaColeccion(coleccion: Coleccion) {

    // Una vez tenemos el logo del equipo seleccionado, buscamos sus alumnos
    console.log('voy a mostrar los cromos de la coleccion ' + coleccion.id);

    // Busca los cromos dela coleccion en la base de datos
    this.peticionesAPI.DameCromosColeccion(coleccion.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.cromosColeccion = res;
        this.cromosColeccion.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        this.PreparaImagenesCromos();
        this.PreparaAlbum();
        console.log(res);
      } else {
        console.log('No hay cromos en esta coleccion');
        // Mensaje usuario
        this.cromosColeccion = undefined;
      }
    });
  }

  // Busca la imagen que tiene el nombre del cromo.Imagen y lo carga en imagenCromo
  PreparaImagenesCromos() {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      let cromo: Cromo;
      cromo = this.cromosColeccion[i];
      this.imagenCromoDelante[i] = URL.ImagenesCromo + cromo.ImagenDelante;

      if (this.coleccion.DosCaras ) {
        this.imagenCromoDetras[i] = URL.ImagenesCromo + cromo.ImagenDetras;
      }
    }
  }

  PreparaAlbum() {
    console.log ('cromos del alumno');
    console.log (this.cromosAlumno);

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.cromosColeccion.length; i++) {

      this.cromo = this.cromosAlumno.filter(res => res.id === this.cromosColeccion[i].id)[0];


      if (this.cromo !== undefined) {
        this.tengoCromo[i] = true;
      } else {
        this.tengoCromo[i] = false;
      }
    }

  }
  Voltear() {
    this.voltear = !this.voltear;
  }


}
