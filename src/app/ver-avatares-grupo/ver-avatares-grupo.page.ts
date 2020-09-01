import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { Alumno, Equipo, Juego, Punto, Nivel, AlumnoJuegoDePuntos, EquipoJuegoDePuntos,
  TablaAlumnoJuegoDePuntos, TablaEquipoJuegoDePuntos, JuegoDeAvatar, AlumnoJuegoDeAvatar } from '../clases/index';

import * as URL from '../URLs/urls';

@Component({
  selector: 'app-ver-avatares-grupo',
  templateUrl: './ver-avatares-grupo.page.html',
  styleUrls: ['./ver-avatares-grupo.page.scss'],
})
export class VerAvataresGrupoPage implements OnInit {
  juegoSeleccionado: JuegoDeAvatar;
  inscripcionesAlumnosJuegoDeAvatar: AlumnoJuegoDeAvatar[];
  alumnosJuegoDeAvatar: Alumno[];
  imagenesAvatares = URL.ImagenesAvatares;
  listaAvatares: any[] = [];

  constructor(
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    this.PrepararAvatares ();

  }
  PrepararAvatares() {
    // Preparo una lista que contenga para cada alumno sus datos, su inscripción y la voz de su avatar 

    this.peticionesAPI.DameInscripcionesAlumnoJuegoDeAvatar(this.juegoSeleccionado.id)
    .subscribe(inscripciones => {
      this.inscripcionesAlumnosJuegoDeAvatar = inscripciones;
      // traemos los alumnos (donde está el nombre)
      this.peticionesAPI.DameAlumnosJuegoDeAvatar(this.juegoSeleccionado.id)
      .subscribe(alumnos => {
        this.alumnosJuegoDeAvatar = alumnos;
        // Ahora preparo la lista con la inscripción y el nombre de los alumnos
        this.inscripcionesAlumnosJuegoDeAvatar.forEach (inscripcion => {
          // busco el alumno al que corresponde la inscripción
          const alumno = this.alumnosJuegoDeAvatar.filter (a => a.id === inscripcion.alumnoId )[0];

          const avatar = {
            insc: inscripcion,
            al: alumno,
            voz: URL.AudiosAvatares + inscripcion.Voz
          };
          this.listaAvatares.push (avatar);
        });
      });

    });
  }
  
}
