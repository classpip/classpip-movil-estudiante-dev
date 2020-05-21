import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

import { IonicModule } from '@ionic/angular';

import { JuegoCompeticionLigaPage } from './juego-competicion-liga.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoCompeticionLigaPage
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
  declarations: [JuegoCompeticionLigaPage]
})
export class JuegoCompeticionLigaPageModule {}
