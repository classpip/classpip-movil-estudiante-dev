import { Pipe, PipeTransform } from '@angular/core';
import {AlumnoJuegoEvaluado} from '../clases/AlumnoJuegoEvaluado';

@Pipe({
  name: 'filtrarAlumnoEvaluador'
})
export class FiltrarAlumnoEvaluadorPipe implements PipeTransform {

  transform(
      alumnos: AlumnoJuegoEvaluado[],
      evaluadorId: number
      ): AlumnoJuegoEvaluado[] {
    if (!alumnos || !evaluadorId) {
      return alumnos;
    }
    return alumnos.filter(alumno => alumno.alumnosEvaluadoresIds.includes(evaluadorId));
  }

}
