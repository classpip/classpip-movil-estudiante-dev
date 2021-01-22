import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PeticionesAPIService, SesionService} from '../servicios';
import {Alumno, Equipo, Rubrica} from '../clases';
import {JuegoDeEvaluacion} from '../clases/JuegoDeEvaluacion';
import {AlertController, LoadingController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-pagina-evaluar',
  templateUrl: './pagina-evaluar.page.html',
  styleUrls: ['./pagina-evaluar.page.scss'],
})
export class PaginaEvaluarPage implements OnInit {

  rutaId: number;
  juego: JuegoDeEvaluacion;
  miAlumno: Alumno;
  alumnos: Alumno[];
  miEquipo: Equipo;
  alumnosDeMiEquipo: Alumno[];
  equipos: Equipo[];
  rubrica: Rubrica;
  respuestaEvaluacion: Array<any>;
  // Form elements
  allCompleted: Array<boolean>;
  indeterminated: Array<boolean>;
  comentario = '';
  forceExit = false;
  estado: boolean;

  constructor(
      private route: ActivatedRoute,
      private peticionesAPI: PeticionesAPIService,
      private sesion: SesionService,
      private loadingController: LoadingController,
      public alertController: AlertController,
      private navCtrl: NavController
  ) {
    this.rutaId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
  }

  ngOnInit() {
    this.juego = this.sesion.DameJuegoEvaluacion();
    this.miAlumno = this.sesion.DameAlumno();
    this.miEquipo = this.sesion.DameEquipo();
    this.peticionesAPI.DameRubrica(this.juego.rubricaId).subscribe((res: Rubrica) => {
      this.rubrica = res;
      this.respuestaEvaluacion = new Array<any>(this.rubrica.Criterios.length);
      this.rubrica.Criterios.forEach((item, index) => {
        this.respuestaEvaluacion[index] = new Array<boolean>(this.rubrica.Criterios[index].Elementos.length).fill(false);
      });
      this.respuestaEvaluacion.push('');
      this.allCompleted = new Array<boolean>(this.rubrica.Criterios.length).fill(false);
      this.indeterminated = new Array<boolean>(this.rubrica.Criterios.length).fill(false);
      this.estado = this.EstadoEvaluacion();
    });
    if (this.juego.Modo === 'Individual') {
      this.alumnos = this.sesion.DameAlumnos();
    } else if (this.juego.Modo === 'Equipos') {
      this.equipos = this.sesion.DameEquipos();
      this.alumnosDeMiEquipo = this.sesion.DameAlumnosDeMiEquipo();
    }
  }

  EstadoEvaluacion(): boolean {
    const alumnosJuegoDeEvaluacion = this.sesion.DameAlumnosJuegoDeEvaluacion();
    const equiposJuegoDeEvaluacion = this.sesion.DameEquiposJuegoDeEvaluacion();
    if (this.juego.Modo === 'Individual' && typeof alumnosJuegoDeEvaluacion !== 'undefined') {
      const relacion = alumnosJuegoDeEvaluacion.find(item => item.alumnoId === this.rutaId);
      if (!relacion || !relacion.respuestas) {
        return false;
      }
      const miRespuesta = relacion.respuestas.find(item => item.alumnoId === this.miAlumno.id);
      if (!miRespuesta) {
        return false;
      } else {
        this.respuestaEvaluacion = miRespuesta.respuesta;
        this.comentario = this.respuestaEvaluacion[this.respuestaEvaluacion.length - 1];
        this.forceExit = true;
        return true;
      }
    } else if (this.juego.Modo === 'Equipos' && typeof equiposJuegoDeEvaluacion !== 'undefined') {
      const relacion = equiposJuegoDeEvaluacion.find(item => item.equipoId === this.rutaId);
      if (!relacion || !relacion.respuestas) {
        return false;
      }
      const miRespuesta = relacion.respuestas.find(item => item.alumnoId === this.rutaId);
      if (miRespuesta) {
        this.respuestaEvaluacion = miRespuesta.respuesta;
        this.comentario = this.respuestaEvaluacion[this.respuestaEvaluacion.length - 1];
        this.forceExit = true;
        return true;
      }
      if (relacion.alumnosEvaluadoresIds === null &&
          typeof this.alumnosDeMiEquipo !== 'undefined' &&
          relacion.respuestas.find(item => this.alumnosDeMiEquipo.map(a => a.id).includes(item.alumnoId))
      ) {
        // tslint:disable-next-line:max-line-length
        this.respuestaEvaluacion = relacion.respuestas.find(item => this.alumnosDeMiEquipo.map(a => a.id).includes(item.alumnoId)).respuesta;
        this.comentario = this.respuestaEvaluacion[this.respuestaEvaluacion.length - 1];
        this.forceExit = true;
        return true;
      } else {
        return false;
      }
    }
  }

  public async alertGoBack() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'Cuidado',
      message: 'Tienes cambios hechos, ¿seguro que quieres salir?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            console.log('Sí');
            this.forceExit = true;
          }
        },
        {
          text: 'No',
          handler: () => {
            this.forceExit = false;
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss();
    console.log(this.forceExit);
    return this.forceExit;
  }

  public canDeactivate() {
    console.log('Check if can deactivate');
    if (this.forceExit) {
      return true;
    }
    // @ts-ignore
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.respuestaEvaluacion.length; i++) {
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.respuestaEvaluacion[i].length; j++) {
        if (this.respuestaEvaluacion[i][j] === true) {
          return false;
        }
      }
    }
    return this.comentario.length === 0;
  }

  SetAll(i: number): void {
    if (this.respuestaEvaluacion[i] == null) {
      return;
    }
    setTimeout(() => {
      for (let j = 0; j < this.respuestaEvaluacion[i].length; j++) {
        this.respuestaEvaluacion[i][j] = this.allCompleted[i];
      }
    });
  }

  CheckboxChanged(i: number): void {
    if (this.respuestaEvaluacion[i] == null) {
      return;
    }
    const allItems = this.respuestaEvaluacion[i].length;
    const selectedItems = this.respuestaEvaluacion[i].filter(item => item === true).length;
    if (selectedItems > 0 && selectedItems < allItems) {
      this.indeterminated[i] = true;
      this.allCompleted[i] = false;
    } else if (selectedItems === allItems) {
      this.indeterminated[i] = false;
      this.allCompleted[i] = true;
    } else {
      this.indeterminated[i] = false;
      this.allCompleted[i] = false;
    }
  }

  DameNombreEvaluado(): string {
    if (this.juego.Modo === 'Individual' && typeof this.alumnos !== 'undefined') {
      const alumno: Alumno = this.alumnos.find(item => item.id === this.rutaId);
      return alumno.Nombre + ' ' + alumno.PrimerApellido + ' ' + alumno.SegundoApellido;
    } else if (this.juego.Modo === 'Equipos' && typeof this.equipos !== 'undefined') {
      const equipo: Equipo = this.equipos.find(item => item.id === this.rutaId);
      return equipo.Nombre;
    }
  }

  DameImagenEvaluado(): string {
    if (this.juego.Modo === 'Individual' && typeof this.alumnos !== 'undefined') {
      const alumno: Alumno = this.alumnos.find(item => item.id === this.rutaId);
      return alumno.ImagenPerfil;
    } else if (this.juego.Modo === 'Equipos' && typeof this.equipos !== 'undefined') {
      const equipo: Equipo = this.equipos.find(item => item.id === this.rutaId);
      return equipo.FotoEquipo;
    }
  }

  async presentAlert(success: boolean, alreadyvoted = false) {
    if (success) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Enviado correctamente',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              console.log('Confirm Ok');
              this.forceExit = true;
              this.navCtrl.back();
            }
          }
        ]
      });
      await alert.present();
    } else if (alreadyvoted) {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Error',
        message: 'No se ha enviado el resultado porque ya has votado anteriormente',
        buttons: [
          {
            text: 'Volver',
            handler: () => {
              this.forceExit = true;
              console.log('Volver');
              this.navCtrl.back();
            }
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: 'Error',
        message: 'Ha habido un error enviando la respuesta...',
        buttons: [
          {
            text: 'Reintentar',
            handler: () => {
              this.forceExit = false;
              console.log('Reintentar');
              this.EnviarRespuesta();
            }
          },
          {
            text: 'Cancelar',
            handler: () => {
              this.forceExit = false;
              console.log('Cancelar');
            }
          }
        ]
      });
      await alert.present();
    }
  }

  async EnviarRespuesta() {
    const loading = await this.loadingController.create({
      message: 'Enviando respuesta...'
    });
    await loading.present();

    this.respuestaEvaluacion[this.respuestaEvaluacion.length - 1] = this.comentario;
    console.log(this.respuestaEvaluacion);
    if (this.juego.Modo === 'Individual') {
      this.peticionesAPI.DameRelacionAlumnosJuegoDeEvaluacion(this.juego.id).subscribe((res) => {
        const tmp = res.find(item => item.alumnoId === this.rutaId);
        if (typeof tmp === 'undefined') {
          this.sesion.TomaAlumnosJuegoDeEvaluacion(res);
          loading.dismiss();
          this.presentAlert(false);
          console.error('no se ha recibido la respuesta esperada', tmp);
        } else {
          let respuestas: any[];
          if (tmp.respuestas === null) {
            respuestas = [];
          } else {
            if (tmp.respuestas.find(item => item.alumnoId === this.miAlumno.id)) {
              console.log('Ya he votado');
              this.sesion.TomaAlumnosJuegoDeEvaluacion(res);
              loading.dismiss();
              this.presentAlert(false, true);
              return;
            }
            respuestas = tmp.respuestas;
          }
          respuestas.push({alumnoId: this.miAlumno.id, respuesta: this.respuestaEvaluacion});
          this.peticionesAPI.EnviarRespuestaAlumnosJuegoDeEvaluacion(tmp.id, {respuestas})
              .subscribe((res2) => {
                console.log(res2);
                console.log('Pre-change', res);
                res = res.map((item) => item.id === res2.id ? res2 : item);
                console.log('Post-change', res);
                this.sesion.TomaAlumnosJuegoDeEvaluacion(res);
                loading.dismiss();
                this.presentAlert(true);
              });
        }
      });
    } else if (this.juego.Modo === 'Equipos') {
      this.peticionesAPI.DameRelacionEquiposJuegoEvaluado(this.juego.id).subscribe((res) => {
        const tmp = res.find(item => item.equipoId === this.rutaId);
        console.log(tmp);
        if (typeof tmp === 'undefined') {
          this.sesion.TomaEquiposJuegoDeEvaluacion(res);
          loading.dismiss();
          this.presentAlert(false);
          console.error('no se ha recibido la respuesta esperada', tmp);
          return;
        }
        let respuestas: any[];
        if (tmp.respuestas === null) {
          respuestas = [];
        } else {
          if (tmp.respuestas.find(item => item.alumnoId === this.miAlumno.id)) {
            console.log('Ya he votado');
            this.sesion.TomaEquiposJuegoDeEvaluacion(res);
            loading.dismiss();
            this.presentAlert(false, true);
            return;
          }
          if (tmp.alumnosEvaluadoresIds === null &&
              tmp.respuestas.find(item => this.alumnosDeMiEquipo.map(a => a.id).includes(item.alumnoId))
          ) {
            console.log('Uno de mi equipo ya ha votado');
            this.sesion.TomaEquiposJuegoDeEvaluacion(res);
            loading.dismiss();
            this.presentAlert(false, true);
            return;
          }
          respuestas = tmp.respuestas;
        }
        respuestas.push({alumnoId: this.miAlumno.id, respuesta: this.respuestaEvaluacion});
        this.peticionesAPI.EnviarRespuestaEquiposJuegoDeEvaluacion(tmp.id, {respuestas})
            .subscribe((res2) => {
              console.log(res2);
              console.log('Pre-change', res);
              res = res.map((item) => item.id === res2.id ? res2 : item);
              console.log('Post-change', res);
              this.sesion.TomaEquiposJuegoDeEvaluacion(res);
              loading.dismiss();
              this.presentAlert(true);
            });
      });
    }
  }

}
