import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-client-stats',
  standalone: false,
  templateUrl: './client-stats.component.html',
  styleUrl: './client-stats.component.scss'
})
export class ClientStatsComponent {
  @Input() stats: any;

  getBudgetColorClass(): string {
    if (!this.stats) return 'success';
    const percent = parseFloat(this.stats.budgetPercent);
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  }
}
