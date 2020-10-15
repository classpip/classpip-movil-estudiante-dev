import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule, MatRadioModule } from '@angular/material';

import { JuegoCuestionarioSatisfaccionPage } from './juego-cuestionario-satisfaccion.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoCuestionarioSatisfaccionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatStepperModule,
    MatRadioModule,
    MatInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoCuestionarioSatisfaccionPage]
})
export class JuegoCuestionarioSatisfaccionPageModule {}
