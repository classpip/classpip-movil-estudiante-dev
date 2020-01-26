import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IntercambiarCromosPage } from './intercambiar-cromos.page';

const routes: Routes = [
  {
    path: '',
    component: IntercambiarCromosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IntercambiarCromosPage]
})
export class IntercambiarCromosPageModule {}
