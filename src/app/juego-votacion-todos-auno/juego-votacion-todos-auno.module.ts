import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {MatExpansionModule} from '@angular/material/expansion';
import { JuegoVotacionTodosAUnoPage } from './juego-votacion-todos-auno.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoVotacionTodosAUnoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatExpansionModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoVotacionTodosAUnoPage]
})
export class JuegoVotacionTodosAUnoPageModule {}
