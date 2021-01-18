import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { JuegoDeCuestionarioPage } from '../juego-de-cuestionario/juego-de-cuestionario.page';

@Injectable()
export class CanExitCuestionarioGuardService implements CanDeactivate<JuegoDeCuestionarioPage> {
  canDeactivate(
    component: JuegoDeCuestionarioPage,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canExit();
  }
}
