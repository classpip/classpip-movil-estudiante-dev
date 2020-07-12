import { Component, OnInit, ViewChild } from '@angular/core';
import { SesionService, PeticionesAPIService } from '../servicios';
import { FamiliaAvatares, JuegoDeAvatar } from 'src/app/clases';
import { IonContent, IonSegment } from '@ionic/angular';
import * as URL from '../URLs/urls';
import { observable, Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import html2canvas from 'html2canvas';
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

  imagenSilueta: string;
  c1: any[];
  c2: any[];
  c3: any[];
  c4: any[];
  privilegiosalumno: boolean[];
  hayComplementoPuesto: boolean[];
  elementoPuesto: any[];
  FamiliaSeleccionada: boolean = false;
  Tipo: string;

  @ViewChild(IonContent, { static: false }) content: IonContent;
  //@ViewChild(IonSegment, { static: false }) segment: IonSegment;
  constructor(private peticionesAPI: PeticionesAPIService,
    private sesion: SesionService) { }

  ngOnInit() {
    this.privilegiosalumno = this.sesion.DamePrivilegiosAlumno();
    console.log("estos son tus privilegios");
    console.log(this.privilegiosalumno);
    this.hayComplementoPuesto = Array(4).fill(false);
    this.elementoPuesto = Array(4);
    this.juegoSeleccionado = this.sesion.DameJuegoAvatar();
    this.familiasDelJuego = [];
    this.juegoSeleccionado.Familias.forEach(familiaId =>
      this.peticionesAPI.DameFamilia(familiaId)
        .subscribe(familia => this.familiasDelJuego.push(familia)
        ));
    console.log('estas son las familias que hay');
    console.log(this.familiasDelJuego);
    console.log('esta es la primera familia?');
    console.log('este es el juego actual');
    console.log(this.juegoSeleccionado);
  }

  ionViewWillEnter() {
    this.Tipo = "comp1";
  }

  TraeImagenesFamilia(familia: FamiliaAvatares) {
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
    this.MuestraFamiliaSeleccionada();
  }

  MuestraFamiliaSeleccionada() {
    for (let i = 0; i < this.elementoPuesto.length; i++) {
      if(this.elementoPuesto[i]){
        this.removeImage(this.elementoPuesto[i]);
        this.elementoPuesto[i] = "";
        this.hayComplementoPuesto[i] = false;
      }
    }
    this.FamiliaSeleccionada = true;
    this.scrollToBottom();
  }

  Muestra(elem, comp, index) {
    console.log("este es el elemento:")
    console.log(elem);
    console.log("este es el complemento:")
    console.log(comp);
    const img = document.createElement("img");
    img.setAttribute('src', elem);
    img.style.position = 'absolute';
    img.style.width = '300px'; img.style.height = '324px';
    const comp2 = comp.toString();
    const index2 = index.toString();
    const id = comp2 + index2;
    img.setAttribute("id", comp2 + index2);
    console.log(img);
    if (comp === 1) {
      img.style.zIndex = "1";
      this.addImage(0, img, id);
    }
    else if (comp === 2) {
      img.style.zIndex = "2";
      this.addImage(1, img, id);
    }
    else if (comp === 3) {
      img.style.zIndex = "3";
      this.addImage(2, img, id);
    }
    else if (comp === 4) {
      img.style.zIndex = "4";
      this.addImage(3, img, id);
    }
  }

  addImage(comp, img, id) {
    if (this.hayComplementoPuesto[comp] === false) {
      var el = document.getElementById("ImagenAvatar");
      el.appendChild(img);
      this.hayComplementoPuesto[comp] = true;
      this.elementoPuesto[comp] = id;
      console.log("elementopuesto: ")
      console.log(this.elementoPuesto);
    } else {
      if (this.elementoPuesto[comp] !== img.id) {
        this.removeImage(this.elementoPuesto[comp]);
        var el = document.getElementById("ImagenAvatar");
        el.appendChild(img);
        this.hayComplementoPuesto[comp] = true;
        this.elementoPuesto[comp] = img.id;
      }
    }
  }

  removeImage(id) {
    var elementToBeRemoved = document.getElementById(id);
    elementToBeRemoved.parentNode.removeChild(elementToBeRemoved);
  }
  scrollToBottom() {
    this.content.scrollToBottom(300);
  }

}
