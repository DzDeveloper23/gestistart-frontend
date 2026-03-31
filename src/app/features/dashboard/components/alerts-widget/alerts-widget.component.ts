import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerts-widget',
  standalone: false,
  templateUrl: './alerts-widget.component.html',
  styleUrl: './alerts-widget.component.scss'
})
export class AlertsWidgetComponent {
  @Input() riskProjects: any[] = [];
  @Input() overdueProjects: any[] = [];

  get hasAlerts(): boolean {
    return this.riskProjects.length > 0 || this.overdueProjects.length > 0;
  }
}
