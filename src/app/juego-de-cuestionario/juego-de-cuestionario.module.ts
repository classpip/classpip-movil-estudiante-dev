import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoDeCuestionarioPage } from './juego-de-cuestionario.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoDeCuestionarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoDeCuestionarioPage]
})
export class JuegoDeCuestionarioPageModule {}
