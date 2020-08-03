import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { FamiliaAvatares, JuegoDeAvatar, AlumnoJuegoDeAvatar } from 'src/app/clases';
import { IonContent, IonSegment , AlertController} from '@ionic/angular';
import * as URL from '../URLs/urls';
import { observable, Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import html2canvas from 'html2canvas';
import { ModalController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.page.html',
  styleUrls: ['./avatar-editor.page.scss'],
})
export class AvatarEditorPage implements OnInit {

  familiasDelJuego: FamiliaAvatares[];
  familiaId: number;
  familiaCargada = false;
  familiaElegida: FamiliaAvatares;
  juegoSeleccionado: JuegoDeAvatar;

  inscripcionAlumnoJuegoAvatar: AlumnoJuegoDeAvatar;

  imagenSilueta: string;
  c1: any[];
  c2: any[];
  c3: any[];
  c4: any[];
  privilegiosAlumno: boolean[];
  hayComplementoPuesto: boolean[];
  elementoPuesto: any[];
  complementoElegido: any[] = [];
  FamiliaSeleccionada: boolean = false;
  Tipo: string;
  modificacion = false;
  interval;
  tieneAvatar = false;
  imagenPequenaSilueta;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(private peticionesAPI: PeticionesAPIService,
              private sesion: SesionService,
              private alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private servidor: Socket) { }

  ngOnInit() {
    this.servidor.connect();
    this.inscripcionAlumnoJuegoAvatar = this.sesion.DameInscripcionAlumno();
    this.privilegiosAlumno = this.inscripcionAlumnoJuegoAvatar.Privilegios;
    this.hayComplementoPuesto = Array(4).fill(false);
    this.hayComplementoPuesto = Array(4).fill(false);
    this.elementoPuesto = Array(4);
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    this.familiasDelJuego = [];
    let cont = 0;
    this.juegoSeleccionado.Familias.forEach(familiaId =>
        this.peticionesAPI.DameFamilia(familiaId)
        .subscribe(familia => {
          this.familiasDelJuego.push(familia);
          cont = cont + 1;
          if (cont === this.juegoSeleccionado.Familias.length ) {
            // ya tengo todas las familias del juego
            if (this.inscripcionAlumnoJuegoAvatar.Silueta !== undefined) {
              // Ya tiene avatar
              this.tieneAvatar = true;
              // Preparo la familia del avatar que tiene
              // La manera de buscar es usar el nombre de la silueta
              // tslint:disable-next-line:max-line-length
              this.familiaElegida = this.familiasDelJuego.filter (f => this.inscripcionAlumnoJuegoAvatar.Silueta === f.Silueta)[0];
              console.log ('la famimia que tiene es');
              console.log (this.familiaElegida);
              this.MuestraAvatar();
            }
          }
        }
      ));
    }
  

  ionViewWillEnter() {
    this.Tipo = "comp1";
  }
 
  TraeImagenesFamilia(familia: FamiliaAvatares) {
    // para hacer aparecer el boton de guardar en el caso de que se haya modificado el avatar
    this.tieneAvatar = true;
    this.modificacion = false;

    this.familiaCargada = false;
    this.familiaElegida = familia;
    this.imagenSilueta = URL.ImagenesAvatares + this.familiaElegida.Silueta;
    this.TraerImagenesComplementos();
  }
  TraerImagenesComplementos() {

    // Vamos a por las imagenes de cada uno de los complementos

    console.log('voy a por los complementos de la familia ');
    console.log(this.familiaElegida);
    this.c1 = [];
    this.familiaElegida.Complemento1.forEach(imagenComplemento => {
      this.c1.push(URL.ImagenesAvatares + imagenComplemento);
    });

    this.c2 = [];
    this.familiaElegida.Complemento2.forEach(imagenComplemento => {
      this.c2.push(URL.ImagenesAvatares + imagenComplemento);
    });
    this.c3 = [];
    this.familiaElegida.Complemento3.forEach(imagenComplemento => {
      this.c3.push(URL.ImagenesAvatares + imagenComplemento);
    });
    this.c4 = [];
    this.familiaElegida.Complemento4.forEach(imagenComplemento => {
      this.c4.push(URL.ImagenesAvatares + imagenComplemento);
    });

    this.familiaCargada = true;
    // Elimino las imagenes de la familia mostrada anteriormente
    this.EliminaImagenes();
  }



  MuestraAvatar() {
    // Hay un problama para mostrar el avatar
    // resulta que la operación getElementById (que se usa en addImage) no funciona bien si el elemento
    // que quiero obtener tiene un *ngIf, porque de acuerdo con el ciclo de ejecición
    // de Angular, primero obtiene el elemento y luego mira el *ngIf para ver si lo
    // tiene que colocar o no, con lo cual, al obtener el elemento lo que obtiene es un null.
    // Para alterar ese ciclo de ejecición basta con poner la función que llama a getElementById dentro de un timer.
    // Esto hace que cambie el orden en el que se hacen las cosas y el getElementById lo haga
    // despues de decidir el *ngIf.
    // El timer puede tener un tiempo de disparo de 0. Con eso basta.

    this.interval = setInterval(() => {
    // si ya tiene avatar aqui lo preparamos todo para que lo muestre
 
      this.imagenSilueta = URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Silueta;

      if (this.inscripcionAlumnoJuegoAvatar.Complemento1 !== undefined) {
        const index = this.familiaElegida.Complemento1.indexOf (this.inscripcionAlumnoJuegoAvatar.Complemento1);
        this.Muestra (URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Complemento1, 1, index);
      }

      if (this.inscripcionAlumnoJuegoAvatar.Complemento2 !== undefined) {
        const index = this.familiaElegida.Complemento2.indexOf (this.inscripcionAlumnoJuegoAvatar.Complemento2);
        this.Muestra (URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Complemento2, 2, index);
      }

      if (this.inscripcionAlumnoJuegoAvatar.Complemento3 !== undefined) {
        const index = this.familiaElegida.Complemento3.indexOf (this.inscripcionAlumnoJuegoAvatar.Complemento3);
        this.Muestra ( URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Complemento3, 3, index);
      }

      if (this.inscripcionAlumnoJuegoAvatar.Complemento4 !== undefined) {
        const index = this.familiaElegida.Complemento4.indexOf (this.inscripcionAlumnoJuegoAvatar.Complemento4);
        this.Muestra ( URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Complemento4, 4, index);
      }
      clearInterval(this.interval);
    }, 0);
  }

  EliminaImagenes() {
    console.log ('voy a eliminar imagenes');
    console.log (this.elementoPuesto);
    for (let i = 0; i < this.elementoPuesto.length; i++) {
      if (this.elementoPuesto[i]) {
        this.removeImage(this.elementoPuesto[i]);
        this.elementoPuesto[i] = "";
        this.hayComplementoPuesto[i] = false;
      }
    }
    this.FamiliaSeleccionada = true;
    this.scrollToBottom();
  }
  Pon(elem, comp, index){
    this.modificacion = true;
    this.Muestra(elem, comp, index);
  }
  Muestra(elem, comp, index) {
    this.complementoElegido[comp - 1] = index;
    const img = document.createElement("img");
    img.setAttribute('src', elem);
    img.style.position = 'absolute';
    img.style.width = '300px'; 
    img.style.height = '324px';
    const comp2 = comp.toString();
    const index2 = index.toString();
    const id = comp2 + index2;
    // El id lo necesito para poder poner y quitar la imagenes de los complementos
    // a medida que el usuario los va eligiendo
    img.setAttribute("id", comp2 + index2);
    console.log(img);
    if (comp === 1) {
      img.style.zIndex = "1";
      this.addImage(0, img, id);
    } else if (comp === 2) {
      img.style.zIndex = "2";
      this.addImage(1, img, id);
    } else if (comp === 3) {
      img.style.zIndex = "3";
      this.addImage(2, img, id);
    } else if (comp === 4) {
      img.style.zIndex = "4";
      this.addImage(3, img, id);
    }
  }

  addImage(comp, img, id) {
    if (this.hayComplementoPuesto[comp] === false) {
        const el = document.getElementById('ImagenAvatar');
        el.appendChild(img);
        this.hayComplementoPuesto[comp] = true;
        this.elementoPuesto[comp] = id;

      } else {
        if (this.elementoPuesto[comp] !== img.id) {
          this.removeImage(this.elementoPuesto[comp]);
          const el = document.getElementById('ImagenAvatar');
          el.appendChild(img);
          this.hayComplementoPuesto[comp] = true;
          this.elementoPuesto[comp] = img.id;
        }
    }
  }

  removeImage(id) {
    const elementToBeRemoved = document.getElementById(id);
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
  }
  EliminarComplementos() {
    for (let i = 0; i < this.hayComplementoPuesto.length; i++) {
      if (this.hayComplementoPuesto [i]) {
        const elementToBeRemoved = document.getElementById(this.elementoPuesto[i]);
        elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
        this.hayComplementoPuesto[i] = false;
      }
    }
  }
  scrollToBottom() {
    this.content.scrollToBottom(300);
  }

  async Guardar() {

    const confirm = await this.alertCtrl.create({
      header: '¿Seguro que quieres modificar tu avatar?',
      buttons: [
        {
          text: 'SI',
          handler: async () => {
            // actualizo los datos de la inscripción
            this.inscripcionAlumnoJuegoAvatar.Silueta =  this.familiaElegida.Silueta;
            if (this.hayComplementoPuesto[0]) {
              this.inscripcionAlumnoJuegoAvatar.Complemento1 = this.familiaElegida.Complemento1[this.complementoElegido[0]];
            } else {
              this.inscripcionAlumnoJuegoAvatar.Complemento1 = undefined;
            }
            if (this.hayComplementoPuesto[1]) {
              this.inscripcionAlumnoJuegoAvatar.Complemento2 = this.familiaElegida.Complemento2[this.complementoElegido[1]];
            } else {
              this.inscripcionAlumnoJuegoAvatar.Complemento2 = undefined;
            }
            if (this.hayComplementoPuesto[2]) {
              this.inscripcionAlumnoJuegoAvatar.Complemento3 = this.familiaElegida.Complemento3[this.complementoElegido[2]];
            } else {
              this.inscripcionAlumnoJuegoAvatar.Complemento3 = undefined;
            }
            if (this.hayComplementoPuesto[3]) {
              this.inscripcionAlumnoJuegoAvatar.Complemento4 = this.familiaElegida.Complemento4[this.complementoElegido[3]];
            } else {
              this.inscripcionAlumnoJuegoAvatar.Complemento4 = undefined;
            }
            // Notifico al server que se ha modificado un avatar
            this.servidor.emit('modificacionAvatar', { inscripcion: this.inscripcionAlumnoJuegoAvatar});

            this.peticionesAPI.ModificaInscripcionAlumnoJuegoDeAvatar (this.inscripcionAlumnoJuegoAvatar)
            .subscribe (async () => {
              // tslint:disable-next-line:no-shadowed-variable
              const confirm = await this.alertCtrl.create({
                header: 'Avatar modificado con éxito',
                buttons: [
                  {
                    text: 'OK',
                    handler: async () => {
                      // cierro la página model preparando la respuesta
                      this.modalCtrl.dismiss({
                        hayCambio: true,
                        inscripcion: this.inscripcionAlumnoJuegoAvatar
                      });
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
  Volver () {
        // cierro la página model preparando la respuesta
    this.modalCtrl.dismiss({
      hayCambio: false,
      inscripcion: this.inscripcionAlumnoJuegoAvatar
    });

  }

  PreparaEjemplo(familia: FamiliaAvatares, i: number) {
    // El ejemplo se construye con la primera opción de cada complemento
    this.modificacion = false;
    this.imagenPequenaSilueta = URL.ImagenesAvatares + familia.Silueta;
    // La imagen de ejemplo de cada familia de avatar tiene un id que es simplemente el 
    // indice de la familia.

    const imagenAvatar = document.getElementById(i.toString());

    const imagen1 = this.CreaImagen (1, URL.ImagenesAvatares +  familia.Complemento1[0]);
    imagenAvatar.appendChild(imagen1);

    const imagen2 = this.CreaImagen (2, URL.ImagenesAvatares +  familia.Complemento2[0]);
    imagenAvatar.appendChild(imagen2);

    const imagen3 = this.CreaImagen (3, URL.ImagenesAvatares +  familia.Complemento3[0]);
    imagenAvatar.appendChild(imagen3);

    const imagen4 = this.CreaImagen (4, URL.ImagenesAvatares +  familia.Complemento4[0]);
    imagenAvatar.appendChild(imagen4);
  }

//   MostrarAvatar() {
//     // Hay un problama para mostrar el avatar
//     // resulta que la operación getElementById no funciona bien si el elemento
//     // que quiero obtener tiene un *ngIf, porque de acuerdo con el ciclo de ejecición
//     // de Angular, primero obtiene el elemento y luego mira el *ngIf para ver si lo
//     // tiene que colocar o no, con lo cual, al obtener el elemento lo que obtiene es un null.
//     // Para alterar ese ciclo de ejecición basta con poner el getElementById dentro de un timer.
//     // Esto hace que cambie el orden en el que se hacen las cosas y el getElementById lo haga
//     // despues de decidir el *ngIf.
//     // El timer puede tener un tiempo de disparo de 0. Con eso basta.
//     let imagenAvatar;

//     this.interval = setInterval(() => {
//       imagenAvatar = document.getElementById('imagenAvatar');
//       this.imagenSilueta = URL.ImagenesAvatares + this.inscripcionAlumnoJuegoAvatar.Silueta;

//       // Ahora traigo los complementos, si existen
//       if (this.inscripcionAlumnoJuegoAvatar.Complemento1 !== undefined) {
//         const imagen1 = this.CreaImagen (1, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento1);
//         console.log ('IMAGEN');
//         console.log (imagen1);
//         imagenAvatar.appendChild(imagen1);
//       }
//       if (this.inscripcionAlumnoJuegoAvatar.Complemento2 !== undefined) {
//         const imagen2 = this.CreaImagen (2, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento2);
//         imagenAvatar.appendChild(imagen2);
//       }
//       if (this.inscripcionAlumnoJuegoAvatar.Complemento3 !== undefined) {
//         const imagen3 = this.CreaImagen (3, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento3);
//         imagenAvatar.appendChild(imagen3);
//       }

//       if (this.inscripcionAlumnoJuegoAvatar.Complemento4 !== undefined) {
//         const imagen4 = this.CreaImagen (4, URL.ImagenesAvatares +  this.inscripcionAlumnoJuegoAvatar.Complemento4);
//         imagenAvatar.appendChild(imagen4);
//       }
//       clearInterval(this.interval);

//     }, 0);
// }

CreaImagen(numeroComplemento: number, imagenString: string): any {
  // se usa para crear la imagen del ejemplo de avatar, que es más pequeño
  const imagen = document.createElement('img');
  imagen.style.position = 'absolute';
  imagen.style.width = '70px'; 
  imagen.style.height = '83.16px';
  // los complementos se apilan según el orden indicado por el numero de complemento.
  imagen.style.zIndex = numeroComplemento.toString();

  imagen.src =  imagenString;
  return imagen;
}


}
