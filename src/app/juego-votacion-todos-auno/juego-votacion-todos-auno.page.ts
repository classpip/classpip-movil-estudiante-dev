import { EquipoJuegoDeVotacionTodosAUno } from './../clases/EquipoJuegoDeVotacionTodosAUno';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PeticionesAPIService, SesionService } from '../servicios/index';
import { CalculosService, ComServerService } from '../servicios';
import { NavController, AlertController, PickerController } from '@ionic/angular';
import { JuegoDeVotacionTodosAUno, Alumno, AlumnoJuegoDeVotacionTodosAUno, Equipo } from '../clases';
import {PickerOptions} from '@ionic/core';
import {MatAccordion} from '@angular/material/expansion';

import { WheelSelector } from '@ionic-native/wheel-selector/ngx';


@Component({
  selector: 'app-juego-votacion-todos-auno',
  templateUrl: './juego-votacion-todos-auno.page.html',
  styleUrls: ['./juego-votacion-todos-auno.page.scss'],
})
export class JuegoVotacionTodosAUnoPage implements OnInit {
  @ViewChild('accordion', {static: false}) accordion: MatAccordion;

  juegoSeleccionado: any;
  alumno: Alumno;
  equipo: Equipo;
  inscripcionAlumnoJuegoDeVotacionTodosAUno: AlumnoJuegoDeVotacionTodosAUno;
  inscripcionEquipoJuegoDeVotacionTodosAUno: EquipoJuegoDeVotacionTodosAUno;
  alumnos: Alumno[];
  equipos: Equipo[];
  equiposVotados: any[];
  alumnosVotados: Alumno[];
  hideMe = true;
  listaAlumnos: any[];
  opcionesPicker: PickerOptions;
  pickerAction;
  jsonData;

  

  constructor(
    public navCtrl: NavController,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
    private alertCtrl: AlertController,
    private pickerCtrl: PickerController,
    private comServer: ComServerService,
    private selector: WheelSelector
  ) { }

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    this.alumno = this.sesion.DameAlumno();
    if (this.juegoSeleccionado.Modo === 'Individual') {
       // Traigo la inscripción del alumno
      this.peticionesAPI.DameInscripcionAlumnoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id, this.alumno.id)
      .subscribe (inscripcion => {
        this.inscripcionAlumnoJuegoDeVotacionTodosAUno = inscripcion[0];
        console.log ('ya tengo la inscripcion');
        console.log (this.inscripcionAlumnoJuegoDeVotacionTodosAUno);
        // traigo los alumnos del juego
        this.peticionesAPI.DameAlumnosJuegoDeVotacionTodosAUno (this.juegoSeleccionado.id)
        .subscribe (alumnos => {
          this.alumnos = alumnos;
          this.PreparaLista();
        });

      });
     } else {
      this.peticionesAPI.DameEquipoDeAlumno(this.juegoSeleccionado.grupoId, this.alumno.id)
      .subscribe((equipo: Equipo[]) => {
          this.equipo = equipo[0];
          // Traigo la inscripción del equipo
          this.peticionesAPI.DameInscripcionEquipoJuegoDeVotacionTodosAUno(this.juegoSeleccionado.id, this.equipo.id)
          .subscribe (inscripcion => {
            this.inscripcionEquipoJuegoDeVotacionTodosAUno = inscripcion[0];
            // traigo los equipos del juego
            this.peticionesAPI.DameEquiposJuegoDeVotacionTodosAUno (this.juegoSeleccionado.id)
            .subscribe (equipos => {
              this.equipos = equipos;
            
              if (this.YaHasVotado()) {
                  // Si han votado preparlo la lista solo con los equipos a los que han votado
                  // para mostrar el resultado de su votación
                  this.equiposVotados = [];
                  // primero selecciono los votos que tengo que mostrar
                  let votosAMostrar;
                  if (this.juegoSeleccionado.VotanEquipos) {
                    votosAMostrar = this.inscripcionEquipoJuegoDeVotacionTodosAUno.VotosEmitidos;
                  } else {
                    votosAMostrar = this.inscripcionEquipoJuegoDeVotacionTodosAUno.VotosEmitidos.filter (voto => voto.alumnoId === this.alumno.id);
                  }
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < votosAMostrar.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    const equipo = this.equipos.filter (eq => eq.id === votosAMostrar[i].equipoId)[0];
                    this.equiposVotados.push ({
                      eq: equipo,
                      puntos: votosAMostrar[i].puntos
                    });
                  }
                  // tslint:disable-next-line:only-arrow-functions
                  this.equiposVotados = this.equiposVotados.sort(function(a, b) {
                    return b.puntos - a.puntos;
                  });
              }
            });
    
          });
      });
    }
  }

  PreparaLista() {
    this.listaAlumnos = [];
    this.alumnos.forEach (alumno => {
      if (alumno.id !== this.alumno.id) {
            // tslint:disable-next-line:max-line-length
            const votosRecibidos = this.inscripcionAlumnoJuegoDeVotacionTodosAUno.VotosEmitidos.filter (votos => votos.alumnoId === alumno.id)[0];
            console.log ('votos recibidos por ' + alumno.Nombre);
            console.log (votosRecibidos);
            if (votosRecibidos === undefined) {
              const item = {
                al : alumno,
                votos : undefined,
                registrado: false
              };
              this.listaAlumnos.push (item);
            } else {
              const item = {
                al : alumno,
                votos : votosRecibidos.votos,
                registrado: true
              };
              this.listaAlumnos.push (item);
            }
      }
    });
    console.log ('Ya esta preparada la lista de alumnos');
    console.log (this.listaAlumnos);
  }


// basic selection, setting initial displayed default values: '3' 'Banana'
MuestraWheel(indice: number) {
  let opciones = {
      title: "AAAAa",
      items: [],
      positiveButtonText: "Ok",
      negativeButtonText: "Nope"
  };
  this.juegoSeleccionado.Conceptos.forEach(concepto => {
    const numeros = [
      { description: '0' },
      { description: '1' },
      { description: '2' },
      { description: '3' },
      { description: '4' },
      { description: '5' },
      { description: '6' },
      { description: '7' },
      { description: '8' },
      { description: '9' },
      { description: '10' }
    ];
    opciones.items.push (numeros);
  });

  this.selector.show(opciones)
  .then(
    result => {
      const votos = [];
      for (let i = 0; i < this.juegoSeleccionado.Conceptos.lenght; i++) {
        votos.push(Number(result[i].description));
      }
      this.listaAlumnos[indice].votos = votos;
    },
    err => console.log('Error: ' + JSON.stringify(err))
  );


}

  async MuestraPicker(indice: number) {
    console.log ('Estamos en muestra picket ' + indice);

    console.log ('lista antes');
    console.log (this.listaAlumnos);
    // Por alguna razon las opciones del Picker hay que prepararlas cada
    // vez. Si lo hago una sola vez al principio no funciona

    this.opcionesPicker = {
      buttons: [
        {
          text: 'Cancel',
          handler: value => {
            this.pickerAction = 'cancel';
          }
        },
        {
          text: 'Done',
          handler: value => {
            this.pickerAction = 'done';
          }
        }

      ],
      columns: []
    };
    this.juegoSeleccionado.Conceptos.forEach(concepto => {
      const columna = {
        name : concepto,
        prefix: concepto,
        options: [
          { text: '0', value: 0},
          { text: '1', value: 1},
          { text: '2', value: 2},
          { text: '3', value: 3},
          { text: '4', value: 4},
          { text: '5', value: 5},
          { text: '6', value: 6},
          { text: '7', value: 7},
          { text: '8', value: 8},
          { text: '9', value: 9},
          { text: '10', value: 10}
         ]
      };
      this.opcionesPicker.columns.push (columna);
    });

    const picker = await this.pickerCtrl.create(this.opcionesPicker);
    picker.present();
    picker.onDidDismiss ().then ( async data => {
      if (this.pickerAction === 'done') {
        const votos = [];
        this.juegoSeleccionado.Conceptos.forEach(async concepto => {
          const col = await picker.getColumn (concepto);
          votos.push(col.options[col.selectedIndex].value);
        });
        this.listaAlumnos[indice].votos = votos;
        console.log ('lista despues');
        console.log (this.listaAlumnos);
      }
      this.accordion.closeAll();

    });
  }

  MuestraEmitir() {
    this.hideMe = true;

  }
  CierraEmitir() {

    this.hideMe = false;

  }

  VotacionFinalizada(): boolean {
    if (this.listaAlumnos) {
      let cont = 0;
      this.listaAlumnos.forEach (item => {
        if (item.registrado) {cont++; }
      });
      return (cont === this.listaAlumnos.length);
    } else {
      return false;
    }
  }


  YaHasVotado(): boolean {
    if (this.inscripcionEquipoJuegoDeVotacionTodosAUno.VotosEmitidos) {
      // Alguien del equipo ha votado
      if (this.juegoSeleccionado.VotanEquipos) {
        // El qequipo ya ha votado
        return true;
      } else {
        // Veamos si ha votado el alumno
        return this.inscripcionEquipoJuegoDeVotacionTodosAUno.VotosEmitidos.some (voto => voto.alumnoId === this.alumno.id);
      }

    } else {
      return false;
    }

  }


  // función para enviar las votaciones. Es async porque usa una alarma
  async Enviar() {
    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres enviar tus votaciones?',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            this.inscripcionAlumnoJuegoDeVotacionTodosAUno.VotosEmitidos = [];
            this.listaAlumnos.forEach (item => {
                if (item.votos) {
                  this.inscripcionAlumnoJuegoDeVotacionTodosAUno.VotosEmitidos.push (
                    {
                      alumnoId: item.al.id,
                      votos: item.votos
                    });
                  item.registrado = true;
                }
            });

            this.peticionesAPI.RegistraVotaciones (this.inscripcionAlumnoJuegoDeVotacionTodosAUno)
            .subscribe (async () => {
              // Notifico al server que un alumno ha votado
              // No envio ninguna información. El Dash recuperara las inscripciones
              // de la base de datos y actualizará la tabla.
              console.log ('emito votaciones');
              this.comServer.Emitir('notificarVotaciones', {});
              // tslint:disable-next-line:no-shadowed-variable
              const confirm = await this.alertCtrl.create({
                header: 'Votaciones registradas con éxito',
                buttons: [
                  {
                    text: 'OK',
                    handler: async () => {
                    }
                  }

                ]
              });
              await confirm.present();
            });
          }
        }, {
          text: 'NO',
          role: 'cancel',

          handler: () => {
          }
        }
      ]
    });
    await confirm.present();

  }


}
