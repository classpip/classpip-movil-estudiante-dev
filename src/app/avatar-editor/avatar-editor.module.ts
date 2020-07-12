import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';

import { IonicModule } from '@ionic/angular';

import { AvatarEditorPage } from './avatar-editor.page';

const routes: Routes = [
  {
    path: '',
    component: AvatarEditorPage
  }
];

@NgModule({
  imports: [
    MatExpansionModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AvatarEditorPage]
})
export class AvatarEditorPageModule {}
