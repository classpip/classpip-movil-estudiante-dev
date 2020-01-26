import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CromosAMostrarPage } from './cromos-amostrar.page';

const routes: Routes = [
  {
    path: '',
    component: CromosAMostrarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CromosAMostrarPage]
})
export class CromosAMostrarPageModule {}
