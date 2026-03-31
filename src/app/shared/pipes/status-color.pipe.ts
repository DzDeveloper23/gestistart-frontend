import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: false
})
export class StatusColorPipe implements PipeTransform {

  transform(status: string): string {
    const statusMap: { [key: string]: string } = {
      // Project statuses
      'En cours': 'success',
      'En attente': 'warning',
      'Terminé': 'primary',
      'Suspendu': 'danger',

      // Task statuses
      'À faire': 'secondary',
      'En révision': 'info',
      'Terminée': 'success',

      // Client statuses
      'Actif': 'success',
      'Inactif': 'secondary',
      'Prospect': 'info',

      // Employee statuses
      'Congé': 'warning'
    };

    return statusMap[status] || 'secondary';
  }

}
