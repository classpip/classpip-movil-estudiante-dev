import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage{


  constructor(
    private router: Router) {}

  slides = [
    {
      /* Theme 2 */
      img: 'assets/sliders/slide1-bg-theme2.svg',
      /* Theme 4 */
      /* img: 'assets/sliders/slide1-bg-theme4.svg', */
      title: 'Juegos',
      text: 'Suma puntos y consigue<br>nuevas recompensas'
    },
    {
      /* Theme 2 */
      img: 'assets/sliders/slide2-bg-theme2.svg',
      /* Theme 4 */
      /* img: 'assets/sliders/slide2-bg-theme4.svg', */
      title: 'Grupo',
      text:'Interactua con tus<br>compañeros'
    },
    {
      /* Theme 2 */
      img: 'assets/sliders/slide3-bg-theme2.svg',
      /* Theme 4 */
      /* img: 'assets/sliders/slide3-bg-theme4.svg', */
      title: 'Grupo',
      text: 'Edita tu perfil y accede<br>a tu inventario'
    }
  ];

  nextpage() {
    this.router.navigateByUrl('home');
  }
}
