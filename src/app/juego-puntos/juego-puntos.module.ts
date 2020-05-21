import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import { IonicModule } from '@ionic/angular';

import { JuegoPuntosPage } from './juego-puntos.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoPuntosPage
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
  declarations: [JuegoPuntosPage]
})
export class JuegoPuntosPageModule {}
