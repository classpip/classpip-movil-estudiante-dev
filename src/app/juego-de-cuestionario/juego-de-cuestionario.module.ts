import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JuegoDeCuestionarioPage } from './juego-de-cuestionario.page';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatRadioModule } from '@angular/material';
import {CanExitCuestionarioGuardService} from '../servicios/can-exit-cuestionario-guard.service';

const routes: Routes = [
  {
    path: '',
    component: JuegoDeCuestionarioPage,
    canDeactivate: [CanExitCuestionarioGuardService]
  }
];

@NgModule({
  imports: [
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JuegoDeCuestionarioPage],
  providers: [CanExitCuestionarioGuardService]
})
export class JuegoDeCuestionarioPageModule {}
