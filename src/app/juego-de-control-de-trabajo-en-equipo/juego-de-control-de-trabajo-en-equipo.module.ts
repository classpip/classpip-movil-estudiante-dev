import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoDeControlDeTrabajoEnEquipoPage } from './juego-de-control-de-trabajo-en-equipo.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoDeControlDeTrabajoEnEquipoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoDeControlDeTrabajoEnEquipoPage]
})
export class JuegoDeControlDeTrabajoEnEquipoPageModule {}
