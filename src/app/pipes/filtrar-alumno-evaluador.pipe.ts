import { Pipe, PipeTransform } from '@angular/core';
import {AlumnoJuegoEvaluado} from '../clases/AlumnoJuegoEvaluado';

@Pipe({
  name: 'filtrarAlumnoEvaluador'
})
export class FiltrarAlumnoEvaluadorPipe implements PipeTransform {

  transform(alumnosJuegoEvaluado: AlumnoJuegoEvaluado[], evaluadorId: number): AlumnoJuegoEvaluado[] {
    if (!alumnosJuegoEvaluado || !evaluadorId) {
      return alumnosJuegoEvaluado;
    }
    return alumnosJuegoEvaluado.filter(item => item.alumnosEvaluadoresIds.includes(evaluadorId));
  }

}
