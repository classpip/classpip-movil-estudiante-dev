import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoEvaluacionPage } from './juego-evaluacion.page';
import {FiltrarAlumnoEvaluadorPipe} from '../pipes/filtrar-alumno-evaluador.pipe';
import {FiltrarEquipoEvaluadorPipe} from '../pipes/filtrar-equipo-evaluador.pipe';

const routes: Routes = [
  {
    path: '',
    component: JuegoEvaluacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoEvaluacionPage, FiltrarAlumnoEvaluadorPipe, FiltrarEquipoEvaluadorPipe]
})
export class JuegoEvaluacionPageModule {}
