import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { SesionService} from '../servicios/sesion.service';
import { Grupo, Alumno } from '../clases/index';
import * as URL from '../URLs/urls';

@Component({
  selector: 'app-mis-grupos',
  templateUrl: './mis-grupos.page.html',
  styleUrls: ['./mis-grupos.page.scss'],
})
export class MisGruposPage implements OnInit {

  Grupos: Grupo[];
  Alumno: Alumno;
  listaGruposYAlumnos: any;
  listaGruposYEquipos: any [];
  Tipo: string;
  constructor(
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    private calculos: CalculosService,
  ) { }

  ngOnInit() {
    this.Alumno = this.sesion.DameAlumno();
    this.peticionesAPI.DameGruposAlumno(this.Alumno.id).subscribe(
      MisGrupos => {
        this.Grupos = MisGrupos;
        console.log(this.Grupos);
        this.calculos.DameLosGruposYLosAlumnos(this.Grupos)
        .subscribe (lista => {
          this.listaGruposYAlumnos = lista;
          // this.listaGruposYAlumnos.forEach (grupo => {
          //   console.log ('grupo');
          //   console.log (grupo);
          //   grupo.Alumnos.forEach (alumno => {
          //     alumno.ImagenPerfil = URL.ImagenesPerfil + alumno.ImagenPerfil;
          //   });

          // });
        });

        this.calculos.DameLosGruposYLosEquipos(this.Grupos)
        .subscribe (lista =>   this.listaGruposYEquipos = lista);
        
        // Necesito una nueva clase para añadir el id del grupo y asi diferenciarlos a la hora de mostrarlos por grupo
      });
  }
  ionViewWillEnter (){
    this.Tipo = "Alumnos";
  }
}
