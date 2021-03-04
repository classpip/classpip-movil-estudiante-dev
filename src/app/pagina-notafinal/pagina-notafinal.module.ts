import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaginaNotafinalPage } from './pagina-notafinal.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaNotafinalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaginaNotafinalPage]
})
export class PaginaNotafinalPageModule {}
