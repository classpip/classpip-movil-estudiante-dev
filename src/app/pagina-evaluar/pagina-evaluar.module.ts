import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaEvaluarPage } from './pagina-evaluar.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaEvaluarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaginaEvaluarPage]
})
export class PaginaEvaluarPageModule {}
