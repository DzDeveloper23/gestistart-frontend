import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-stats',
  standalone: false,
  templateUrl: './employee-stats.component.html',
  styleUrl: './employee-stats.component.scss'
})
export class EmployeeStatsComponent {
  @Input() stats: any;

  getCompletionColor(): string {
    if (!this.stats) return 'success';
    const rate = parseFloat(this.stats.tauxCompletion);
    if (rate >= 80) return 'success';
    if (rate >= 50) return 'warning';
    return 'danger';
  }
}
