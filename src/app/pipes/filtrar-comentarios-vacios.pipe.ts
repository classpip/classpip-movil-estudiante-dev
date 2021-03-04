import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarComentariosVacios'
})
export class FiltrarComentariosVaciosPipe implements PipeTransform {

  transform(items: any[]): any[] {
    if (!items) {
      return items;
    }
    return items.filter(item => item.respuesta[item.respuesta.length - 1] !== '');
  }

}
