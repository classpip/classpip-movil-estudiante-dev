import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PuntosMiEquipoPage } from './puntos-mi-equipo.page';

const routes: Routes = [
  {
    path: '',
    component: PuntosMiEquipoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PuntosMiEquipoPage]
})
export class PuntosMiEquipoPageModule {}
