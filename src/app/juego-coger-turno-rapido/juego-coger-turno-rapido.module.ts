import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoCogerTurnoRapidoPage } from './juego-coger-turno-rapido.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoCogerTurnoRapidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoCogerTurnoRapidoPage]
})
export class JuegoCogerTurnoRapidoPageModule {}
