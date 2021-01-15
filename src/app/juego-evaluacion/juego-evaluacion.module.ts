import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoEvaluacionPage } from './juego-evaluacion.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoEvaluacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoEvaluacionPage]
})
export class JuegoEvaluacionPageModule {}
