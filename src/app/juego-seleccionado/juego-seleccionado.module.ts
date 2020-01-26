import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoSeleccionadoPage } from './juego-seleccionado.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoSeleccionadoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoSeleccionadoPage]
})
export class JuegoSeleccionadoPageModule {}
