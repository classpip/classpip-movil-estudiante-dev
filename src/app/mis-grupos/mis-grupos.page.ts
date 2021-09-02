import { Component, OnInit,ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { SesionService} from '../servicios/sesion.service';
import { Grupo, Alumno, Equipo, AlumnoJuegoDeVotacionTodosAUno } from '../clases/index';
import * as URL from '../URLs/urls';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-mis-grupos',
  templateUrl: './mis-grupos.page.html',
  styleUrls: ['./mis-grupos.page.scss'],
})
export class MisGruposPage implements OnInit {
  @ViewChild('accordion', {static: false}) accordion: MatAccordion;

  Grupos: Grupo[];
  Alumno: Alumno;
  listaGruposYAlumnos: any;
  listaGruposYEquipos: any [];
  Tipo: string;
  equiposDelAlumno: Equipo[];
  equipoElegido: Equipo;
  alumnosEquipo: Alumno[];
  mostrarAlumnos = true;
  mostrarEquipos = false;
  equiposDelGrupo: Equipo[];

  constructor(
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.Alumno = this.sesion.DameAlumno();
    this.peticionesAPI.DameEquiposDelAlumno (this.Alumno.id)
    .subscribe (equipos => this.equiposDelAlumno = equipos);
    this.peticionesAPI.DameGruposAlumno(this.Alumno.id).subscribe(
      MisGrupos => {
        console.log ('ya tengo los grupos');
        this.Grupos = MisGrupos;
        console.log(this.Grupos);
        this.calculos.DameLosGruposYLosAlumnos(this.Grupos)
        .subscribe (lista => {
          this.listaGruposYAlumnos = lista;
          console.log ('listaGruposYAlumnos');
          console.log (this.listaGruposYAlumnos);
         
        });

        this.calculos.DameLosGruposYLosEquipos(this.Grupos)
        .subscribe (lista =>  {
          this.listaGruposYEquipos = lista;
          console.log ('equipos');
          console.log (this.listaGruposYEquipos);
        });
      });
  }
 
  ionViewWillEnter (){
    this.Tipo = "Alumnos";
  }
  SeleccionarLogo($event) {
  
    console.log ('Cambio logo del equipo');
    console.log (this.equiposDelAlumno);
    const imagen = $event.target.files[0];
    const formData = new FormData();
    formData.append(imagen.name, imagen);
    this.peticionesAPI.PonLogoEquipo(formData)
    .subscribe (() => {
      this.equipoElegido.FotoEquipo = URL.LogosEquipos + imagen.name;
      this.peticionesAPI.ModificaEquipo (this.equipoElegido).subscribe();
     });
  }

  CambiarLogo(equipo: Equipo){
    console.log ('voy a cambiar el logo del equipo');
    console.log (equipo);
    this.equipoElegido = equipo;
    if (equipo.FotoEquipo !== undefined) {
      // primero borro el logo si tiene
      // la foto viene con toda la URL y solo quiero el nombre del fichero
      // para borrarlo, que viene al final
      const url = equipo.FotoEquipo.split ('/');
      const imagen = url[url.length - 1];

      this.peticionesAPI.BorraLogoEquipo (imagen).subscribe ();
    }

    document.getElementById('inputLogo').click();
  }

  QuitarLogo(equipo: Equipo) {
    // la foto viene con toda la URL y solo quiero el nombre del fichero
    // para borrarlo, que viene al final
    const url = equipo.FotoEquipo.split ('/');
    const imagen = url[url.length - 1];

    this.peticionesAPI.BorraLogoEquipo (imagen).subscribe ();
    equipo.FotoEquipo = undefined;
    console.log ('voy a modificar el equipo');
    console.log (equipo);
    this.peticionesAPI.ModificaEquipo (equipo)
    .subscribe(e => console.log (e));


  }
  EsMiEquipo(equipo: Equipo) {
    return this.equiposDelAlumno.some (e => e.id === equipo.id);
  }
  TraeAlumnosEquipo(equipo) {
    console.log ('voy a traer los alumnos del equipo');
    console.log (equipo);
    this.peticionesAPI.DameAlumnosEquipo (equipo.id)
    .subscribe (alumnos => {
      this.alumnosEquipo = alumnos;
      console.log ('ya tengo los alumnos del equipo ', this.alumnosEquipo)
    });
    // this.accordion.closeAll();
  }

  TraeEquiposGrupo (grupo) {
    console.log ('Busco equipos del grupo ', grupo);
    this.mostrarEquipos = false;
    // console.log ('en la lista ', this.Grupos);
    // const grupoId = this.Grupos.find (g => g.id = grupo.id).id;
    // console.log ('voy a traer los equipos del grupo ', grupoId);
    this.peticionesAPI.DameEquiposDelGrupo (grupo.id)
    .subscribe (equipos => {
      this.equiposDelGrupo = equipos;
      console.log ('equipos del grupo');
      console.log (this.equiposDelGrupo);
    });
  }
}
