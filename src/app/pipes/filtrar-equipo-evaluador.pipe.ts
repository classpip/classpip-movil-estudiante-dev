import { Pipe, PipeTransform } from '@angular/core';
import {EquipoJuegoEvaluado} from '../clases/EquipoJuegoEvaluado';

@Pipe({
  name: 'filtrarEquipoEvaluador'
})
export class FiltrarEquipoEvaluadorPipe implements PipeTransform {

  transform(
      equipos: EquipoJuegoEvaluado[],
      evaluadorId: { alumnoId: number | null, equipoId: number | null }
  ): EquipoJuegoEvaluado[] {
    if (!equipos || !evaluadorId) {
      return equipos;
    }
    if (evaluadorId.alumnoId != null && evaluadorId.equipoId == null) {
      return equipos.filter(equipo => equipo.alumnosEvaluadoresIds.includes(evaluadorId.alumnoId));
    } else if (evaluadorId.alumnoId == null && evaluadorId.equipoId != null) {
      return equipos.filter(equipo => equipo.equiposEvaluadoresIds.includes(evaluadorId.equipoId));
    } else {
      return equipos;
    }
  }

}
