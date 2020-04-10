import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';

import { IonicModule } from '@ionic/angular';

import { MisPuntosPage } from './mis-puntos.page';

const routes: Routes = [
  {
    path: '',
    component: MisPuntosPage
  }
];

@NgModule({
  imports: [
    MatExpansionModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MisPuntosPage]
})
export class MisPuntosPageModule {}
