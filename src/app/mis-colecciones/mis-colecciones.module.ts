import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MisColeccionesPage } from './mis-colecciones.page';

const routes: Routes = [
  {
    path: '',
    component: MisColeccionesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MisColeccionesPage]
})
export class MisColeccionesPageModule {}
