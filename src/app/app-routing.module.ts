import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'slides', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'inici', loadChildren: './inici/inici.module#IniciPageModule' },
  { path: 'juego-seleccionado', loadChildren: './juego-seleccionado/juego-seleccionado.module#JuegoSeleccionadoPageModule' },
  { path: 'cromos-amostrar', loadChildren: './cromos-amostrar/cromos-amostrar.module#CromosAMostrarPageModule' },
  { path: 'mi-perfil', loadChildren: './mi-perfil/mi-perfil.module#MiPerfilPageModule' },
  { path: 'mis-grupos', loadChildren: './mis-grupos/mis-grupos.module#MisGruposPageModule' },
  { path: 'intercambiar-cromos', loadChildren: './intercambiar-cromos/intercambiar-cromos.module#IntercambiarCromosPageModule' },
  { path: 'juegos-inactivos', loadChildren: './juegos-inactivos/juegos-inactivos.module#JuegosInactivosPageModule' },
  { path: 'slides', loadChildren: './slides/slides.module#SlidesPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'mis-colecciones', loadChildren: './mis-colecciones/mis-colecciones.module#MisColeccionesPageModule' },
  { path: 'juego-de-cuestionario', loadChildren: './juego-de-cuestionario/juego-de-cuestionario.module#JuegoDeCuestionarioPageModule' },
  { path: 'juego-competicion-f1', loadChildren: './juego-competicion-f1/juego-competicion-f1.module#JuegoCompeticionF1PageModule' },
  { path: 'juego-competicion-liga', loadChildren: './juego-competicion-liga/juego-competicion-liga.module#JuegoCompeticionLigaPageModule' },
  { path: 'informacion-jornadas', loadChildren: './informacion-jornadas/informacion-jornadas.module#InformacionJornadasPageModule' },
  { path: 'juego-colleccion', loadChildren: './juego-colleccion/juego-colleccion.module#JuegoColleccionPageModule' },
  { path: 'juego-puntos', loadChildren: './juego-puntos/juego-puntos.module#JuegoPuntosPageModule' },  { path: 'juego-avatar', loadChildren: './juego-avatar/juego-avatar.module#JuegoAvatarPageModule' },
  { path: 'avatar-editor', loadChildren: './avatar-editor/avatar-editor.module#AvatarEditorPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
