import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'orderby',
})
export class OrderbyPipe implements PipeTransform {
  transform(items: any[], field: string): any[] {
    if (!items) {
      return [];
    } else {
      return items.sort(function(a, b){
        return new Date(b[field]).getTime() - new Date(a[field]).getTime();
      });
    }
  }
}
