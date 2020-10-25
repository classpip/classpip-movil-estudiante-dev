import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, AngularDelegate } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
import { Alumno } from '../clases';
import { IniciPage } from '../inici/inici.page';
import { TabsPage } from '../tabs/tabs.page';
import { PeticionesAPIService, SesionService, ComServerService} from '../servicios/index';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
//import { Camera, CameraOptions } from '@ionic-native/camera';

import { Transfer } from '@ionic-native/transfer';
import { Media, MediaObject } from '@ionic-native/media/ngx';

import { WheelSelector } from '@ionic-native/wheel-selector/ngx';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage {
  alumno: Alumno;
  nombre: string;
  apellido: string;
  audioFile: MediaObject;
  playing = false;
  recording = false;
  disponible = false;
  maxTime: any = 30;
  hidevalue = false;
  timer: any;

  coords: any = { lat: 0, lng: 0 };
  latitud;
  longitud;




  panelOpenState = false;
   
  data: any;
  answer: any[] = [];
  cont: any[];
  jsonData: any;


  identificador: any;
  midiendo = false;

  contNotif = 0;
  juegoRapido = false;
  clave: string;
  nickname: string;


  constructor(
    // private http: HttpClient,
    private route: Router,
    public navCtrl: NavController,
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private file: File,
    private media: Media,
    private comServer: ComServerService,
    private selector: WheelSelector,
    private localNotifications: LocalNotifications
    //private transfer: Transfer,
   // private camera: Camera

    )  {

      this.jsonData = {
        numbers: [
          { description: '1' },
          { description: '2' },
          { description: '3' }
        ],
        fruits: [
          { description: 'Apple' },
          { description: 'Banana' },
          { description: 'Tangerine' }
        ],
        firstNames: [
          { name: 'Fred', id: '1' },
          { name: 'Jane', id: '2' },
          { name: 'Bob', id: '3' },
          { name: 'Earl', id: '4' },
          { name: 'Eunice', id: '5' }
        ],
        lastNames: [
          { name: 'Johnson', id: '100' },
          { name: 'Doe', id: '101' },
          { name: 'Kinishiwa', id: '102' },
          { name: 'Gordon', id: '103' },
          { name: 'Smith', id: '104' }
        ]
      };


      // this.cont = Array(2).fill(0);

      // this.data = {"questionnaire": {
      //     "id": "5ac5f074867d190bc471dc59",
      //     "name": "Diabetes Questionnaire Test",
      //   "item": [
      //     {
      //       "text": "Dibujo",
      //       "cont": 0,

      //       "options": [
      //         {
      //           "value": "Los colores son acertados",
      //           "checked": false
      //         },
      //         {
      //           "value": "Es interesante",
      //           "checked": false
      //         },
      //         {
      //           "value": "Me ha hecho reir",
      //           "checked": false
      //         }
      //       ]
      //     },
      //     {

      //       "text": "La voz",
      //       "cont": 0,

      //       "options": [
      //         {
      //           "value": "Me ha hecho reir",
      //           "checked": false
      //         },
      //         {
      //           "value": "Se ha oido perfectamente",
      //           "checked": false
      //         },
            
      //       ]
      //     }
      //   ]
      // }
      // };
  }


    
  // updateAnswer(index,ansindex,value,checked){
  //   if(!Array.isArray(this.answer[index])){
  //     this.answer[index] = []
  //   }
  //   if(checked){
  //    this.answer[index][ansindex] =  true;
  //    this.cont[index]++;
  //   }else{
  //     //this.answer[index].splice(ansindex,1)
  //     this.answer[index][ansindex] =  false;
  //     this.cont[index]--;
  //   }
  // }
  // Resultado() {
  //   console.log ('resultado');
  //   console.log (this.answer);
  // }


    ionViewDidEnter() {

      // this.StartTimer();
    }



  StartTimer() {
    this.timer = setTimeout(x => {
          if (this.maxTime <= 0) { }
          this.maxTime -= 1;
          if (this.maxTime > 0 ) {
            this.hidevalue = false;
            this.StartTimer();
          } else {
              this.hidevalue = true;
          }

      }, 1000);

  }

//     upload()
//     {
    
//      const options = {

//          quality: 100
//           };

//      this.camera.getPicture(options).then((imageData) => {
//      // imageData is either a base64 encoded string or a file URI
//      // If it's base64:
//       const fileTransfer = this.transfer.create();
      

//       const options1: FileUploadOptions = {
//           fileKey: 'file',
//           fileName: 'name.jpg',
//           headers: {}
//       };

//       fileTransfer.upload(imageData, 'https://localhost:3000/api/imagenes/ImagenColeccion/uoload', options1)
//       .then((data) => {
//         // success
//         alert('success');
//       }, (err) => {
//         // error
//         alert('error' + JSON.stringify(err));
//       });


//   });


// }



// basic number selection, index is always returned in the result
selectANumber() {
  this.selector.show({
    title: "How Many?",
    items: [
      this.jsonData.numbers
    ],
  }).then(
    result => {
      console.log(result[0].description + ' at index: ' + result[0].index);
    },
    err => console.log('Error: ', err)
    );
}



// basic selection, setting initial displayed default values: '3' 'Banana'
selectFruit() {
  this.selector.show({
    title: "How Much?",
    items: [
      this.jsonData.numbers, this.jsonData.fruits
    ],
    positiveButtonText: "Ok",
    negativeButtonText: "Nope",
    defaultItems: [
      {index:0, value: this.jsonData.numbers[2].description},
      {index: 1, value: this.jsonData.fruits[3].description}
    ]
  }).then(
    result => {
      console.log(result[0].description + ' ' + result[1].description);
    },
    err => console.log('Error: ' + JSON.stringify(err))
    );
}



// more complex as overrides which key to display
// then retrieve properties from original data
selectNamesUsingDisplayKey() {
  this.selector.show({
    title: "Who?",
    items: [
      this.jsonData.firstNames, this.jsonData.lastNames
    ],
    displayKey: 'name',
    defaultItems: [
      {index:0, value: this.jsonData.firstNames[2].name},
      {index: 0, value: this.jsonData.lastNames[3].name}
    ]
  }).then(
    result => {
      console.log(result[0].name + ' (id= ' + this.jsonData.firstNames[result[0].index].id + '), ' +
        result[1].name + ' (id=' + this.jsonData.lastNames[result[1].index].id + ')');
    },
    err => console.log('Error: ' + JSON.stringify(err))
    );
}


  // Activa la función SeleccionarInfoFamilia
  ActivarInput() {
    console.log('Activar input');
    document.getElementById('inputInfo').click();
}

// Par abuscar el fichero JSON que contiene la info de la familia que se va
// a cargar desde ficheros
SeleccionarFichero($event) {

    const file = $event.target.files[0];
    console.log ('tengo el fichero');
    console.log (file.name);
    const formDataOpcion = new FormData();
    formDataOpcion.append(file.fileName, file);
    this.peticionesAPI.PonAudioAvatar(formDataOpcion)
    .subscribe(() => Swal.fire('Fichero cargado con exito', '', 'success'));
}



startRecord() {
  this.audioFile = this.media.create(this.file.externalRootDirectory + '/audioFile.mp3');
  this.audioFile.startRecord();
  this.recording = true;
}
stopRecord() {
  this.audioFile.stopRecord();
  this.recording = false;
  this.disponible = true;
  Swal.fire('fin de la grabacion');
  //this.fileTransfer = this.transfer.create();

  // const options: FileUploadOptions = {
  //     fileName: 'audio.mp3',
  //     chunkedMode: false,
  //     mimeType: 'multipart/form-data',
  //     params : {fileName: 'audio.mp3'}
  //   };
  // const url = 'localhost:3000/api/imagenes/ImagenColeccion/upload';
  // this.fileTransfer.upload (this.file.externalRootDirectory + '/audioFile.mp3', url , options).then((data) => {

  //   const data1 = JSON.stringify(data);

  //   alert(data1);
  // }, (err) => {

  //   alert(err);
  // });

}

play () {
  this.audioFile.play();
  this.playing = true;
}
pause () {
  this.audioFile.pause();
  this.playing = false;
}
// makeFileIntoBlob(imagePath) {
//   // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
//   return new Promise((resolve, reject) => {
//     let fileName = ' ';
//     this.file
//       .resolveLocalFilesystemUrl(imagePath)
//       .then(fileEntry => {
//         const { name, nativeURL } = fileEntry;

//         // get the path..
//         const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
//         console.log("path", path);
//         console.log("fileName", name);

//         fileName = name;

//         // we are provided the name, so now read the file into
//         // a buffer
//         return this.file.readAsArrayBuffer(path, name);
//       })
//       .then(buffer => {
//         // get the buffer and make a blob to be saved
//         const imgBlob = new Blob([buffer], {
//           type: 'audio/mpeg'
//         });
//         console.log(imgBlob.type, imgBlob.size);
//         resolve({
//           imgBlob
//         });
//       })
//       .catch(e => reject(e));
//   });
// }
replay() {
  
//   // tslint:disable-next-line:only-arrow-functions
//   window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(filesystem) {
//     let file = filesystem.root.toURL.
//     /*and need remove file:// from path so..*/
//     file = file.slice(7);
//  }
//   const blobInfo =  this.makeFileIntoBlob(this.file.externalRootDirectory + '/audioFile.mp3')
//   .then ((blob: Blob) => {
//       Swal.fire('tengo el blob', '', 'success');
    
//       const formDataOpcion = new FormData();
//       formDataOpcion.append('audioFile.mp3', blob);
//       this.peticionesAPI.PonImagenColeccion(formDataOpcion)

//         .subscribe(
//           result => {
//             // Handle result
//             console.log(result);
//           },
//           error => {
//             Swal.fire('Error ' + error, '', 'error');
//           },

//           () => Swal.fire('Fichero cargado con exito', '', 'success'));
//   });


}

empezar () {
  if (this.midiendo) {
    navigator.geolocation.clearWatch (this.identificador);
    this.midiendo = false;
  } else {
    this.midiendo = true;
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    this.identificador = navigator.geolocation.watchPosition((position) => {
      const lat =  position.coords.latitude;
      
      const lon =  position.coords.longitude;
      this.coords.lat = position.coords.latitude;
      this.coords.lng =  position.coords.longitude;
      console.log('latitud ' + lat);
      console.log('longitud ' + lon );
      // tslint:disable-next-line:max-line-length

    //this.distancia = this.calculateDistance(lon, Number(this.puntogeolocalizable.Longitud), lat, Number(this.puntogeolocalizable.Latitud));
    }, null, options);
  }
}

obtenerPosicion(): any{
  console.log('entro en la funcion');
  this.geolocation.getCurrentPosition().then(res => {
    this.coords.lat = res.coords.latitude;
    this.coords.lng = res.coords.longitude;
    console.log(this.coords.lat);
    console.log(this.coords.lng);
    Swal.fire('Coordenadas ' + this.coords.lat + ', ' +  this.coords.lng);

  })
  .catch(
    (error) => {
      console.log(error);
    }
  );
}


    async presentLoading() {
      const loading = await this.loadingController.create({
        message: 'Verificando Usuario',
        duration: 1500
      });
      await loading.present();

      const { role, data } = await loading.onDidDismiss();

      console.log('Loading dismissed!');
    }

    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'Error',
        // subHeader: 'Subtitle',
        message: 'Usuario y/o contraseña incorrectos',
        buttons: ['OK']
      });

      await alert.present();
    }
    AutentificarJuegoRapido() {
        console.log ('Juego rapido ' + this.clave + ' ' + this.nickname);
        this.peticionesAPI.DameJuegoDeEncuestaRapida (this.clave)
        .subscribe ((juego) => {
          if (juego[0] !== undefined) {
            console.log ('Ya tengo el juego');
            console.log (juego[0]);
            this.sesion.TomaJuego(juego[0]);
            this.sesion.TomaNickName (this.nickname);
            this.comServer.EnviarNick (this.nickname);
            // this.route.navigateByUrl('/tabs/inici');
            this.navCtrl.navigateForward('/juego-cuestionario-satisfaccion');

          } else {
            this.peticionesAPI.DameJuegoDeVotacionRapida (this.clave)
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe (async (juego) => {
              if (juego[0] !== undefined) {
                console.log ('Ya tengo el juego');
                console.log (juego[0]);
                this.sesion.TomaJuego(juego[0]);
                this.sesion.TomaNickName (this.nickname);
                this.comServer.EnviarNick (this.nickname);
               
                this.navCtrl.navigateForward('/juego-votacion-rapida');
              } else {
                  this.peticionesAPI.DameJuegoDeCuestionarioRapido (this.clave)
                  // tslint:disable-next-line:no-shadowed-variable
                  .subscribe (async (juego) => {
                    if (juego[0] !== undefined) {
                      console.log ('Ya tengo el juego');
                      console.log (juego[0]);
                      this.sesion.TomaJuego(juego[0]);
                      this.sesion.TomaNickName (this.nickname);
                      this.comServer.EnviarNick (this.nickname);
                    
                      this.navCtrl.navigateForward('/juego-de-cuestionario');
                      } else {
                        this.peticionesAPI.DameJuegoDeCogerTurnoRapido (this.clave)
                        // tslint:disable-next-line:no-shadowed-variable
                        .subscribe (async (juego) => {
                          if (juego[0] !== undefined) {
                            console.log ('Ya tengo el juego');
                            console.log (juego[0]);
                            this.sesion.TomaJuego(juego[0]);
                            this.sesion.TomaNickName (this.nickname);
                            // hay que enviar la clave también para poder recibir notificaciones
                            this.comServer.EnviarNickYClave (this.nickname, this.clave);
                            this.clave = undefined;
                            this.nickname = undefined;
                          
                            this.navCtrl.navigateForward('/juego-coger-turno-rapido');
                          } else {
                              const alert = await this.alertController.create({
                                header: 'Error',
                                // subHeader: 'Subtitle',
                                message: 'No existe ningun juego rápido con esa clave',
                                buttons: ['OK']
                              });
                              await alert.present();
                              this.juegoRapido = false;
                              this.clave = undefined;
                              this.nickname = undefined;
                          }
                        });
                      }
                  });
                }
            });
          }
        });
    }

    Autentificar() {
        this.presentLoading();
        this.peticionesAPI.DameAlumno(this.nombre, this.apellido)
        .subscribe( (res) => {
          if (res[0] !== undefined) {
            this.alumno = res[0];
            this.sesion.TomaAlumno(this.alumno);
            console.log('bien logado');
            this.comServer.Conectar(this.alumno);

            this.comServer.EsperarNotificaciones()
            .subscribe((notificacion: any) => {
              console.log ('Pongo notificacion:  ' + notificacion );
              this.localNotifications.schedule({
                id: ++this.contNotif,
                text: notificacion,
              });

            });

            setTimeout(() => {
              this.route.navigateByUrl('/tabs/inici');
            }, 1500);
          } else {
            // Aqui habría que mostrar alguna alerta al usuario
            setTimeout(() => {
              this.presentAlert();
            }, 1500);
            console.log('alumno no existe');
          }
        });
    }

    AccesoJuegoRapido() {
      this.juegoRapido = true;
    }
    Volver() {
      this.juegoRapido = false;
    }

}



