import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inici',
        children: [
          {
            path: '',
            loadChildren: '../inici/inici.module#IniciPageModule'
          }
        ]
      },
      {
        path: 'mis-juegos-inactivos',
        children: [
          {
            path: '',
            loadChildren: '../mis-juegos-inactivos/mis-juegos-inactivos.module#MisJuegosInactivosPageModule'
          }
        ]
      },
      {
        path: 'mi-perfil',
        children: [
          {
            path: '',
            loadChildren: '../mi-perfil/mi-perfil.module#MiPerfilPageModule'
          }
        ]
      },
      {
        path: 'mis-grupos',
        children: [
          {
            path: '',
            loadChildren: '../mis-grupos/mis-grupos.module#MisGruposPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/inici',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inici',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
