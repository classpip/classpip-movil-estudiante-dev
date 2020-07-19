import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlbumAlumnoPage } from './album-alumno.page';

const routes: Routes = [
  {
    path: '',
    component: AlbumAlumnoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AlbumAlumnoPage]
})
export class AlbumAlumnoPageModule {}
