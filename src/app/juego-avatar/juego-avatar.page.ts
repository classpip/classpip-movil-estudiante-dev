import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService, SesionService, ComServerService } from '../servicios/index';
import { CalculosService } from '../servicios/calculos.service';
import { NavController, AlertController } from '@ionic/angular';
import { Alumno, JuegoDeAvatar, AlumnoJuegoDeAvatar, Evento } from '../clases/index';

import * as URL from '../URLs/urls';
import { ModalController } from '@ionic/angular';
import {AvatarEditorPage} from '../avatar-editor/avatar-editor.page';

@Component({
  selector: 'app-juego-avatar',
  templateUrl: './juego-avatar.page.html',
  styleUrls: ['./juego-avatar.page.scss'],
})
export class JuegoAvatarPage implements OnInit {

  alumno: Alumno;
  InfoMiAlumno: AlumnoJuegoDeAvatar;
  juegoSeleccionado: JuegoDeAvatar;
  alumnosDelJuego: Alumno[];
  inscripcionesAlumnosJuegodeAvatar: AlumnoJuegoDeAvatar[];
  criterios: Array<{nombre: string, criterio: string}>;
  imagenSilueta: any;
  inscripcionAlumnoJuegoAvatar: AlumnoJuegoDeAvatar;
  tieneAvatar = false;
  interval;
  imagenesAvatares = URL.ImagenesAvatares;
  audioAvatar;
  tieneVoz = false;



  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    public modalController: ModalController,
    public alertController: AlertController,
    private comServer: ComServerService,
    private calculos: CalculosService
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    this.alumno = this.sesion.DameAlumno();
    if (this.juegoSeleccionado.Modo === 'Individual') {
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeAvatar (this.juegoSeleccionado.id, this.alumno.id)
      .subscribe (inscripcion => {
        this.inscripcionAlumnoJuegoAvatar = inscripcion[0];
        if (this.inscripcionAlumnoJuegoAvatar.Silueta !== undefined) {
          this.tieneAvatar = true;
          if ((this.inscripcionAlumnoJuegoAvatar.Privilegios[4]) && (this.inscripcionAlumnoJuegoAvatar.Voz)) {
            this.tieneVoz = true;
            this.audioAvatar = URL.AudiosAvatares + this.inscripcionAlumnoJuegoAvatar.Voz;
          }
        }
        this.PrepararCriterios();
      });
     } else {
       // De momento no hay juego de avatar de equipo
     }
  }


  PrepararCriterios() {
    this.criterios = [
      {nombre: 'Complemento 1', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento1},
      {nombre: 'Complemento 2', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento2},
      {nombre: 'Complemento 3', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento3},
      {nombre: 'Complemento 4', criterio: this.juegoSeleccionado.CriteriosPrivilegioComplemento4},
      {nombre: 'Nota de Voz', criterio: this.juegoSeleccionado.CriteriosPrivilegioVoz},
      {nombre: 'Espiar Compañeros', criterio: this.juegoSeleccionado.CriteriosPrivilegioVerTodos}

    ]
  }
  async AbreEditorAvatar() {
    this.sesion.TomaInscripcionAlumno(this.inscripcionAlumnoJuegoAvatar);
    // abrimos la página del editor de forma modal porque interesa recoger el resultado 
    // para actualizar el avatar en esta página
    const modal = await this.modalController.create({
      component: AvatarEditorPage,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    // En data me devuelve dos cosas: si ha habido cambio en el avatar y, 
    // en caso afirmativo, la inscripcion que contiene el avatar cambiado
    if (data.hayCambio) {
      this.tieneAvatar = true;
      this.inscripcionAlumnoJuegoAvatar = data.inscripcion;

      //Registrar la Modificación del Avatar
      this.peticionesAPI.DameGrupo(this.juegoSeleccionado.grupoId).subscribe((grupo) => {

        // tslint:disable-next-line:max-line-length
        const evento: Evento = new Evento(32, new Date(), grupo.profesorId, this.sesion.DameAlumno().id, undefined, this.juegoSeleccionado.id, this.juegoSeleccionado.NombreJuego, this.juegoSeleccionado.Tipo);
        this.calculos.RegistrarEvento (evento);
       
      }, (err) => {
        console.log(err); 
      });
    }
  }

  VerAvatares() {
    this.navCtrl.navigateForward('/ver-avatares-grupo');
  }

  // Activa la función SeleccionarFicheroVoz
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('inputVoz').click();
}

// Selecciona y guarda el fichero de voz
// Si hay uno anterior lo borra.
async SeleccionarFicheroVoz($event) {

    const file = $event.target.files[0];
    if (this.inscripcionAlumnoJuegoAvatar.Voz) {
      // borro el fichero de audio de la voz anterior
      this.peticionesAPI.BorraAudioAvatar (this.inscripcionAlumnoJuegoAvatar.Voz).subscribe();
    }

    this.inscripcionAlumnoJuegoAvatar.Voz = file.name;
    this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeAvatar (this.inscripcionAlumnoJuegoAvatar)
    .subscribe ();
    const formDataOpcion = new FormData();
    formDataOpcion.append(file.fileName, file);
    this.peticionesAPI.PonAudioAvatar(formDataOpcion)
    .subscribe(async () => {
      this.tieneVoz = true;
        // Notifico al server que se ha modificado un avatar
      this.comServer.Emitir('modificacionAvatar', { inscripcion: this.inscripcionAlumnoJuegoAvatar});
      this.audioAvatar = URL.AudiosAvatares + this.inscripcionAlumnoJuegoAvatar.Voz;
      const alert2 = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'voz asignada con exito',
        buttons: ['OK']
      });
      await alert2.present();
    });
}

QuitaVoz() {
  if (this.inscripcionAlumnoJuegoAvatar.Voz) {
    // borro el fichero de audio de la voz anterior
    this.peticionesAPI.BorraAudioAvatar (this.inscripcionAlumnoJuegoAvatar.Voz).subscribe();
    this.inscripcionAlumnoJuegoAvatar.Voz = undefined;
    this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeAvatar (this.inscripcionAlumnoJuegoAvatar)
    .subscribe ();
    this.tieneVoz = false;
  }

}



}
