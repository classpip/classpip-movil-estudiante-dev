import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaEvaluarPage } from './pagina-evaluar.page';
import {CanDeactivateJuegoDeEvaluacionService} from '../guards/can-deactivate-juego-de-evaluacion.service';

const routes: Routes = [
  {
    path: '',
    component: PaginaEvaluarPage,
    canDeactivate: [CanDeactivateJuegoDeEvaluacionService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaginaEvaluarPage],
  providers: [CanDeactivateJuegoDeEvaluacionService]
})
export class PaginaEvaluarPageModule {}
