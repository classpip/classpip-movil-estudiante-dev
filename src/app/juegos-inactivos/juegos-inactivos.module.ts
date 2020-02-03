import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegosInactivosPage } from './juegos-inactivos.page';

const routes: Routes = [
  {
    path: '',
    component: JuegosInactivosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegosInactivosPage]
})
export class JuegosInactivosPageModule {}
