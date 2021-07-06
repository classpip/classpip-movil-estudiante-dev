import { Pipe, PipeTransform } from '@angular/core';
import {EquipoJuegoDeEvaluacion} from '../clases/EquipoJuegoDeEvaluacion';

@Pipe({
  name: 'filtrarEquipoEvaluador'
})
export class FiltrarEquipoEvaluadorPipe implements PipeTransform {

  transform(
      equipos: EquipoJuegoDeEvaluacion[],
      evaluadorId: { alumnoId: number | null, equipoId: number | null }
  ): EquipoJuegoDeEvaluacion[] {
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
