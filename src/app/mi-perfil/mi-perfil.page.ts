import { Component, OnInit } from '@angular/core';
import { PeticionesAPIService} from '../servicios/index';
import { SesionService} from '../servicios/sesion.service';
import { CalculosService } from '../servicios/calculos.service';
import { Alumno } from '../clases/index';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  base64Image: any;
  Alumno: Alumno;
  MiImagenAlumno: string[] = [];
  constructor(
    private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService,
    private calculos: CalculosService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File
  ) { }

  ngOnInit() {
    this.Alumno = this.sesion.DameAlumno();
    console.log(this.Alumno);
    this.MiImagenAlumno = this.calculos.VisualizarImagenAlumno(this.Alumno.ImagenPerfil);
    console.log('Ya tengo la imagen del Alumno');
    console.log(this.MiImagenAlumno);
  }

  accessGallery() {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
      console.log(err);
    });
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      // tslint:disable-next-line:object-literal-shorthand
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

}
