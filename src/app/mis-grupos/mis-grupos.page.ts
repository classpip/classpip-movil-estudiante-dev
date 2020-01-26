import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { SesionService} from '../servicios/sesion.service';
import { Grupo, Alumno } from '../clases/index';
@Component({
  selector: 'app-mis-grupos',
  templateUrl: './mis-grupos.page.html',
  styleUrls: ['./mis-grupos.page.scss'],
})
export class MisGruposPage implements OnInit {

  Grupos: Grupo[];
  Alumno: Alumno;
  listaGruposYAlumnos: any [];
  listaGruposYEquipos: any [];
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
        this.listaGruposYAlumnos = this.calculos.DameLosGruposYLosAlumnos(this.Grupos);
        console.log(this.listaGruposYAlumnos);
        console.log(this.listaGruposYAlumnos.length);
        this.listaGruposYEquipos = this.calculos.DameLosGruposYLosEquipos(this.Grupos);
        // Necesito una nueva clase para añadir el id del grupo y asi diferenciarlos a la hora de mostrarlos por grupo
      });
  }

}
