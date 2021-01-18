
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
  { path: 'mis-juegos-inactivos', loadChildren: './mis-juegos-inactivos/mis-juegos-inactivos.module#MisJuegosInactivosPageModule' },
  { path: 'intercambiar-cromos', loadChildren: './intercambiar-cromos/intercambiar-cromos.module#IntercambiarCromosPageModule' },
  { path: 'juegos-inactivos', loadChildren: './juegos-inactivos/juegos-inactivos.module#JuegosInactivosPageModule' },
  { path: 'slides', loadChildren: './slides/slides.module#SlidesPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'mis-colecciones', loadChildren: './mis-colecciones/mis-colecciones.module#MisColeccionesPageModule' },
  { path: 'juego-de-cuestionario', loadChildren: './juego-de-cuestionario/juego-de-cuestionario.module#JuegoDeCuestionarioPageModule'},
  { path: 'juego-competicion-f1', loadChildren: './juego-competicion-f1/juego-competicion-f1.module#JuegoCompeticionF1PageModule' },
  { path: 'juego-competicion-liga', loadChildren: './juego-competicion-liga/juego-competicion-liga.module#JuegoCompeticionLigaPageModule' },
  { path: 'informacion-jornadas', loadChildren: './informacion-jornadas/informacion-jornadas.module#InformacionJornadasPageModule' },
  { path: 'juego-colleccion', loadChildren: './juego-colleccion/juego-colleccion.module#JuegoColleccionPageModule' },
  { path: 'juego-avatar', loadChildren: './juego-avatar/juego-avatar.module#JuegoAvatarPageModule' },
  { path: 'avatar-editor', loadChildren: './avatar-editor/avatar-editor.module#AvatarEditorPageModule' },

  { path: 'juego-puntos', loadChildren: './juego-puntos/juego-puntos.module#JuegoPuntosPageModule' },
  { path: 'album-alumno', loadChildren: './album-alumno/album-alumno.module#AlbumAlumnoPageModule' },

  { path: 'juego-de-geocaching', loadChildren: './juego-de-geocaching/juego-de-geocaching.module#JuegoDeGeocachingPageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'ver-avatares-grupo', loadChildren: './ver-avatares-grupo/ver-avatares-grupo.module#VerAvataresGrupoPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'juego-votacion-uno-atodos', loadChildren: './juego-votacion-uno-atodos/juego-votacion-uno-atodos.module#JuegoVotacionUnoATodosPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'juego-votacion-todos-auno', loadChildren: './juego-votacion-todos-auno/juego-votacion-todos-auno.module#JuegoVotacionTodosAUnoPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'juego-cuestionario-satisfaccion', loadChildren: './juego-cuestionario-satisfaccion/juego-cuestionario-satisfaccion.module#JuegoCuestionarioSatisfaccionPageModule' },
  { path: 'juego-votacion-rapida', loadChildren: './juego-votacion-rapida/juego-votacion-rapida.module#JuegoVotacionRapidaPageModule' },
  { path: 'mis-juegos-inactivos', loadChildren: './mis-juegos-inactivos/mis-juegos-inactivos.module#MisJuegosInactivosPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'juego-coger-turno-rapido', loadChildren: './juego-coger-turno-rapido/juego-coger-turno-rapido.module#JuegoCogerTurnoRapidoPageModule' },
  { path: 'juego-evaluacion', loadChildren: './juego-evaluacion/juego-evaluacion.module#JuegoEvaluacionPageModule' },
  { path: 'pagina-evaluar/:id', loadChildren: './pagina-evaluar/pagina-evaluar.module#PaginaEvaluarPageModule' }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


