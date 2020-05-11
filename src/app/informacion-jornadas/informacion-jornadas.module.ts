import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';

import { IonicModule } from '@ionic/angular';

import { InformacionJornadasPage } from './informacion-jornadas.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionJornadasPage
  }
];

@NgModule({
  imports: [
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InformacionJornadasPage]
})
export class InformacionJornadasPageModule {}
