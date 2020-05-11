import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

import { IonicModule } from '@ionic/angular';

import { JuegoCompeticionF1Page } from './juego-competicion-f1.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoCompeticionF1Page
  }
];

@NgModule({
  imports: [
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoCompeticionF1Page]
})
export class JuegoCompeticionF1PageModule {}
