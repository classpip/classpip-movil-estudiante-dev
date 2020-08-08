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
    private comServer: ComServerService
    //private transfer: Transfer,
   // private camera: Camera

    )  {
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

    Autentificar() {


      this.presentLoading();
      this.peticionesAPI.DameAlumno(this.nombre, this.apellido).subscribe(
        (res) => {
          if (res[0] !== undefined) {
            this.alumno = res[0];
            this.sesion.TomaAlumno(this.alumno);
            console.log('bien logado');
            this.comServer.Conectar();
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
        }
      );
    }

}



