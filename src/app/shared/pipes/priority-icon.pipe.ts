import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityIcon',
  standalone: false
})
export class PriorityIconPipe implements PipeTransform {

 transform(priority: string): string {
    const iconMap: { [key: string]: string } = {
      'Basse': 'bi-arrow-down-circle',
      'Moyenne': 'bi-dash-circle',
      'Haute': 'bi-arrow-up-circle',
      'Critique': 'bi-exclamation-triangle-fill'
    };

    return iconMap[priority] || 'bi-circle';
  }

}
