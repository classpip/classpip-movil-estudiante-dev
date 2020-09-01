import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoVotacionUnoATodosPage } from './juego-votacion-uno-atodos.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoVotacionUnoATodosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoVotacionUnoATodosPage]
})
export class JuegoVotacionUnoATodosPageModule {}
