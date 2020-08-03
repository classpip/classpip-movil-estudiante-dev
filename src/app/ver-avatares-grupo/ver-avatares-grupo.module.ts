import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerAvataresGrupoPage } from './ver-avatares-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: VerAvataresGrupoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerAvataresGrupoPage]
})
export class VerAvataresGrupoPageModule {}
