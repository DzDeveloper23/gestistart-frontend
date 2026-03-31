import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-project-stats',
  standalone: false,
  templateUrl: './project-stats.component.html',
  styleUrl: './project-stats.component.scss'
})
export class ProjectStatsComponent {
  @Input() stats: any;

  getBudgetColorClass(): string {
    if (!this.stats) return 'success';
    const percent = parseFloat(this.stats.budgetPercent);
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  }

  getDelayColorClass(): string {
    if (!this.stats) return 'success';
    if (this.stats.isEnRetard) return 'danger';
    if (this.stats.joursRestants <= 7) return 'warning';
    return 'success';
  }
}
