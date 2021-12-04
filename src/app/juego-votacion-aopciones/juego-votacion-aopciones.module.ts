import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoVotacionAOpcionesPage } from './juego-votacion-aopciones.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoVotacionAOpcionesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoVotacionAOpcionesPage]
})
export class JuegoVotacionAOpcionesPageModule {}
