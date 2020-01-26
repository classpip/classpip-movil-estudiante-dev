import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'inici', loadChildren: './inici/inici.module#IniciPageModule' },
  { path: 'juego-seleccionado', loadChildren: './juego-seleccionado/juego-seleccionado.module#JuegoSeleccionadoPageModule' },
  { path: 'cromos-amostrar', loadChildren: './cromos-amostrar/cromos-amostrar.module#CromosAMostrarPageModule' },
  { path: 'mi-perfil', loadChildren: './mi-perfil/mi-perfil.module#MiPerfilPageModule' },
  { path: 'mis-grupos', loadChildren: './mis-grupos/mis-grupos.module#MisGruposPageModule' },
  { path: 'mis-puntos', loadChildren: './mis-puntos/mis-puntos.module#MisPuntosPageModule' },
  { path: 'puntos-mi-equipo', loadChildren: './puntos-mi-equipo/puntos-mi-equipo.module#PuntosMiEquipoPageModule' },
  { path: 'intercambiar-cromos', loadChildren: './intercambiar-cromos/intercambiar-cromos.module#IntercambiarCromosPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
