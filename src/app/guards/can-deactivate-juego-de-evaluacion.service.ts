import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {PaginaEvaluarPage} from '../pagina-evaluar/pagina-evaluar.page';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateJuegoDeEvaluacionService implements CanDeactivate<PaginaEvaluarPage> {
  // tslint:disable-next-line:max-line-length
  canDeactivate(component: PaginaEvaluarPage,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree  {
    console.log('Guarda de Evaluacion');
    console.log(currentRoute.params);
    console.log(currentState.url);
    return component.canDeactivate() || component.alertGoBack();
  }
}
