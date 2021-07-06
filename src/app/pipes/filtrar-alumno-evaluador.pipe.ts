import { Pipe, PipeTransform } from '@angular/core';
import {AlumnoJuegoDeEvaluacion} from '../clases/AlumnoJuegoDeEvaluacion';

@Pipe({
  name: 'filtrarAlumnoEvaluador'
})
export class FiltrarAlumnoEvaluadorPipe implements PipeTransform {

  transform(
      alumnos: AlumnoJuegoDeEvaluacion[],
      evaluadorId: number
      ): AlumnoJuegoDeEvaluacion[] {
    if (!alumnos || !evaluadorId) {
      return alumnos;
    }
    return alumnos.filter(alumno => alumno.alumnosEvaluadoresIds.includes(evaluadorId));
  }

}
